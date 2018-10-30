import React from "react"
import AuthorList from "../components/AuthorList"

const Index = ({ data }) => (
  <div style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh'}}>
    <div style={{marginTop: '-100px'}}>
      <h1> Author List</h1>
      <AuthorList authors={data.hasura.author} />
    </div>
  </div>
)

export default Index;

export const query = graphql`
  query {
    hasura {
      author {
        id
        name
      }
    }
  }`;
