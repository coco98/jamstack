const request = require('request');
const { query } = require('graphqurl');

const HGE_ENDPOINT = process.env.HGE_ENDPOINT || 'http://jamstack.herokuapp.com/v1alpha1/graphql';

const BUILD_QUEUE_TIME = 180;

const GET_SCHEDULED_QUERY = `
query{
  build_queue(where: {scheduled: {_eq: true}}, order_by: {timestamp: desc}){
    id
    scheduled
    timestamp
  }
}
`
const SET_SCHEDULED_DONE_QUERY = `
mutation{
  update_build_queue(where: {scheduled: {_eq: true}}, _set: {scheduled: false}){
    returning{
      id
      timestamp
    }
  }
}
`;

const INSERT_SCHEDULED_QUERY = `
mutation{
  insert_build_queue(objects: [{
    scheduled: true
  }]){
    returning{
      id
    }
  }
}
`;

const getScheduled = async () => {
  var resp = await query({
        endpoint: HGE_ENDPOINT,
        query: GET_SCHEDULED_QUERY
      });
  return resp.data.build_queue;
}

const insertScheduled = async () => {
  var resp = await query({
        endpoint: HGE_ENDPOINT,
        query: INSERT_SCHEDULED_QUERY
      });
  return resp.data.insert_build_queue.returning;
}

const setScheduledDone = async () => {
  var resp = await query({
        endpoint: HGE_ENDPOINT,
        query: SET_SCHEDULED_DONE_QUERY
      });
  return resp.data.update_build_queue.returning;
}


const triggerNetlify = (res) => {
  request.post({
    headers: {'content-type' : 'application/json'},
    url:     process.env.NETLIFY_BUILD_HOOK,
    body:    {},
    json:    true
  }, function(error, response, body){
    var status = (response && response.statusCode) || 500;
    console.log('status: ', status);
    console.log(error);
    if(status == 200) {
      res.status(status).send("build triggered");
    } else {
      res.status(status).send(body);
    }
  });  
}

exports.build = async (req, res) => {

  var scheduledBuilds = await getScheduled();
  console.log('scheduledBuilds:', scheduledBuilds);
  if (scheduledBuilds.length > 0) {
    var lastTimestamp = Math.floor(new Date(scheduledBuilds[0].timestamp).getTime() / 1000);
    var currentTimestamp = Math.floor((new Date).getTime() / 1000);
    // check if there is a build queued
    if ( lastTimestamp > currentTimestamp - BUILD_QUEUE_TIME) {
      res.status(200).send("build is already scheduled");
    } else {
      // if no build queued, then trigger
      await setScheduledDone();
      triggerNetlify(res);
    }
  } else {
    // queue a build
    await insertScheduled();
    res.setHeader("Retry-After", BUILD_QUEUE_TIME);
    res.status(503).send("build scheduled");
  }
};
