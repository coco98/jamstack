const fetch = require(`node-fetch`)
const { createHttpLink } = require(`apollo-link-http`)

module.exports = {
  plugins: [
    'gatsby-plugin-netlify-cache',
    {
      resolve: 'gatsby-source-graphql',
      options: {
        typeName: 'HASURA',
        fieldName: 'hasura',
        createLink: () =>
          createHttpLink({
            uri: 'https://jamstack.herokuapp.com/v1alpha1/graphql',
            headers: {},
            fetch,
          }),
        refetchInterval: 10, // Refresh every 60 seconds for new data
      },
    },
  ]
};
