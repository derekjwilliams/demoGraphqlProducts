import React from "react";
import { render } from "react-dom";
import ApolloClient from "apollo-boost";
import { ApolloProvider, Query } from "react-apollo";
import gql from "graphql-tag";
import { Weather } from "./weather";

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql"
});

const productStyle = {
  display: "grid",
  fontFamily: 'Lucida Grande',
  fontSize: '14px',
  backgroundColor: '#f6f3ea',
  boxShadow: '1px 2px 8px rgba(0, 0, 0, 0.4)',
  padding: '8px',
  margin: '8px',
  background: 'https://my.sit.nutrienagsolutions.com/static/media/registrationBackground-min.d6eb8897.jpg'
}
const productsListStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(380px, 1fr))"
}
const footerStyle = {
  fontStyle: 'italic',
  fontSize: '0.8rem',
  marginTop: '0.8rem'
}
const productImagePlaceholderStyle = {
  objectFit: "cover",
  height: "150px"
}
const manufacturerNameStyle = {
  minHeight: '40px'
}

const variantStyle = {
  margin: '1rem',
  padding: '1rem',
  color: '#111',
  boxShadow: '1px 1px 6px rgba(0, 0, 0, 0.4)',
  backgroundColor: '#fcfbf8'
}
// const [sendMessage, lastMessage, readyState] = useWebSocket('wss://echo.websocket.org', { onOpen: console.log });


const Products = () => (
  <Query
    query={gql`
      {
        allProducts(first: 100, orderBy: NAME_ASC, filter:{enabled: {equalTo:true}}) {
          nodes {
            guid
            name
            description
            enabled
            logoMobile
            shortDescription
            arsKey
            manufacturerName
            commonName
            associatedCountry
            variantsByProductGuid (first: 3) {
              nodes {
                arsKey
                guid
                agrianId
                description
                unitQty
                unitSize
                unitMeasure
                associatedCountry
                agrianId
                enabled
              }
            }
          }
        }
      }
    `}
  >
  
  {({ loading, error, data }) => {
    if (loading) {
      return <p>Loading...</p>
    }
    if (error) {
      return <p>Error, Oh Noes, check the console</p>
    }
    const products = data.allProducts.nodes.map(({ 
      guid, 
      name,
      description,
      manufacturerName,
      variantsByProductGuid,
      commonName,
      associatedCountry,
      logoMobile
    }) => (
      <div key={guid} style={productStyle}>
        <div>
          <h2>
            {name}{commonName ? `- ${commonName}`: ''}({associatedCountry})
          </h2>
          <h3 style={manufacturerNameStyle}>
            {manufacturerName ? `Made By ${manufacturerName}`: ''}
          </h3>
          <img style={productImagePlaceholderStyle} width="100%" src={'https://labs.jensimmons.com/2017/media/01-001/brooklynmuseum-o44489i000-35.867_reference_SL1.jpg'}/>
          <p>
            {description}
          </p>
          <Variants {...variantsByProductGuid}/>
            <footer style={footerStyle}>GUID: {guid}</footer>
        </div>
      </div>
    ));
    return <div style={productsListStyle}>{products}</div>
  }}
  </Query>
);

const Variants = (variantsByProductGuid) => {
  const result = variantsByProductGuid.nodes.map(({
          arsKey,
          guid,
          agrianId,
          description,
          unitQty,
          unitSize,
          unitMeasure,
          associatedCountry,
          enabled,
          position,
          image,
          imageMobile
  }) => 
    <div key={guid} style={variantStyle}>
      <div>
        <div>{description}</div>
        <div>{`arsKey: ${arsKey}`}</div>
        <div>{`guid: ${guid}`}</div>
        <div>{`agrianId: ${agrianId}`}</div>
        <div>{`package: ${unitSize} ${unitMeasure}`}</div>
        <div>{`agrianId: ${agrianId}`}</div>
        <div>{`associatedCountry: ${associatedCountry}`}</div>
        <div>{`enabled: ${enabled}`}</div>
        <div>{`position: ${position}`}</div>
      </div>
      </div>
    )
  return <div><h3>Variants</h3>{result}</div>
  
}


const App = () => (
  <ApolloProvider client={client}>
    <Weather />
    <Products/>
  </ApolloProvider>
);

render(<App />, document.getElementById("root"));
