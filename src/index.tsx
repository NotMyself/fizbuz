import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { ApolloProvider } from 'react-apollo';
import { ApolloProvider as ApolloHooksProvider } from 'react-apollo-hooks';
import { useAuth0, Auth0Provider } from './auth/auth0';
import AUTH_CONFIG from './auth/auth0-config';
// NOTE: the dependency below was added to address https://github.com/parcel-bundler/parcel/issues/1762
import 'regenerator-runtime/runtime';
import './index.css';
import App from './App';

const httpLink = new HttpLink({ uri: process.env.API_URL });

const GraphQLProvider = ({ children }) => {
    const { loading, isAuthenticated, getTokenSilently } = useAuth0();
    if (loading) {
        return <div>Loading...</div>;
    }

    const authLink = setContext(async (_, { headers }) => {
        const token = isAuthenticated ? await getTokenSilently() : null;
        return {
            headers: {
                ...headers,
                Authorization: token ? `Bearer ${token}` : '',
            },
        };
    });

    const client = new ApolloClient({
        link: authLink.concat(httpLink),
        cache: new InMemoryCache(),
    });

    return (
        <ApolloProvider client={client}>
            <ApolloHooksProvider client={client}>{children}</ApolloHooksProvider>
        </ApolloProvider>
    );
};
console.log(window.location.origin);
ReactDOM.render(
    <Auth0Provider
        domain={AUTH_CONFIG.domain}
        client_id={AUTH_CONFIG.clientId}
        audience={AUTH_CONFIG.audience}
        redirect_uri={`${window.location.origin}/home`}
        cacheLocation={AUTH_CONFIG.cacheLocation}
        useRefreshTokens={AUTH_CONFIG.useRefreshTokens}
    >
        <GraphQLProvider>
            <App />
        </GraphQLProvider>
    </Auth0Provider>,
    document.getElementById('root'),
);
