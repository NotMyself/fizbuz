import React from 'react';
import { Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import AppNav from '../components/Nav/AppNav';
import Footer from '../components/Nav/Footer';
import './AppLayout.css';

const AppLayout = ({ component: Component, ...rest }) => {
    return (
        <Route
            {...rest}
            render={(props) => (
                <>
                    <Helmet>
                        <title>Fizbuz</title>
                    </Helmet>
                    <div id="app">
                        <AppNav />
                        <section id="content" style={{ margin: '16px' }}>
                            <Component {...props} />
                        </section>
                        <Footer />
                    </div>
                </>
            )}
        />
    );
};

export default AppLayout;
