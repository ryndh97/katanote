import React, { Component } from 'react';
import { StyleSheet, Image, View, Linking } from 'react-native';

import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createStackNavigator } from 'react-navigation-stack';
import { createDrawerNavigator, DrawerItems } from 'react-navigation-drawer';
import {
    Container,
    Header,
    Content,
    Body,
    Text,
    Thumbnail,
    List,
    ListItem,
    Left,
    Right,
    Icon,
    Footer,
} from 'native-base';
import DB from '../database';

import Home from '../screens/Home';
import AddBoard from '../screens/AddBoard';
import Search from '../screens/Search';
import Cards from '../screens/Cards';
import Detail from '../screens/Detail';
import EditUser from '../screens/EditUser';
import Settings from '../screens/Settings';
import About from '../screens/About';
import Help from '../screens/Help';
import Login from '../screens/Login';
import Register from '../screens/Register';
import Auth from '../screens/Auth';
import ForgotPassword from '../screens/ForgotPassword';

const MAIN_COLOR = '#39b772';

const CustomDrawerContentComponent = (props) => (
    <Container>
        <Header androidStatusBarColor="#34a869" noShadow style={styles.drawerHeader}>
            <Body>
                {/* <Thumbnail source={require('../assets/user.jpg')} style={styles.userImage} /> */}
                <Text style={styles.userName}>KataNote</Text>
                <Text style={styles.description}>your private catalogs and notes</Text>
            </Body>
        </Header>
        <Content>
            <DrawerItems {...props} />
        </Content>
        <Footer
            style={{
                justifyContent: 'flex-start',
                backgroundColor: 'transparent',
            }}
        >
            <View
                style={{
                    margin: 10,
                    alignSelf: 'center',
                    marginLeft: 20,
                }}
            >
                <Text>
                    <Text style={{ fontSize: 12, color: '#a5a5a5' }}>Powered by </Text>
                    <Text
                        style={{ fontSize: 12, color: '#707070' }}
                        onPress={() => {
                            Linking.openURL('https://nore.web.id/');
                        }}
                    >
                        Nore
                    </Text>
                </Text>
            </View>
        </Footer>
    </Container>
);

const StackNavigator = createStackNavigator(
    {
        Home,
        AddBoard,
        Search,
        Cards,
        Detail,
    },
    {
        headerMode: 'none',
    }
);

const SettingStackNavigator = createStackNavigator(
    {
        Settings,
        EditUser,
    },
    {
        headerMode: 'none',
    }
);

const AuthStackNavigator = createStackNavigator(
    {
        Login,
        Register,
        ForgotPassword,
    },
    {
        headerMode: 'none',
    }
);

const Authentication = createSwitchNavigator(
    {
        LoadingScreen: Auth,
        App: SettingStackNavigator,
        Auth: AuthStackNavigator,
    },
    {
        initialRouteName: 'LoadingScreen',
        headerMode: 'none',
    }
);

const DrawerNavigator = createDrawerNavigator(
    {
        Home: {
            screen: StackNavigator,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => (
                    <Icon name="md-home" style={{ fontSize: 24, color: tintColor }} />
                ),
            },
        },
        Settings: {
            screen: Authentication,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => (
                    <Icon name="md-settings" style={{ fontSize: 24, color: tintColor }} />
                ),
            },
        },
        About: {
            screen: About,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => (
                    <Icon
                        name="md-information-circle-outline"
                        style={{ fontSize: 24, color: tintColor }}
                    />
                ),
            },
        },
        Help: {
            screen: Help,
            navigationOptions: {
                drawerIcon: ({ tintColor }) => (
                    <Icon
                        name="md-help-circle-outline"
                        style={{ fontSize: 24, color: tintColor }}
                    />
                ),
            },
        },
    },
    {
        initialRouteName: 'Home',
        drawerPosition: 'left',
        contentComponent: CustomDrawerContentComponent,
        drawerOpenRoute: 'DrawerOpen',
        drawerCloseRoute: 'DrawerClose',
        drawerToggleRoute: 'DrawerToggle',
        contentOptions: {
            itemsContainerStyle: {
                marginTop: -5,
            },
            iconContainerStyle: {
                opacity: 1,
            },
            activeTintColor: MAIN_COLOR,
            inactiveTintColor: '#1e1e1e',
            labelStyle: {
                fontWeight: 'normal',
            },
        },
    }
);

const styles = StyleSheet.create({
    drawerHeader: {
        backgroundColor: '#39b772',
        height: 100,
    },
    userImage: {
        marginBottom: 30,
        width: 70,
        height: 70,
        borderRadius: 75,
    },
    userName: {
        fontWeight: 'bold',
        fontSize: 24,
        color: 'white',
    },
    description: {
        fontWeight: 'normal',
        fontSize: 14,
        color: 'white',
    },
    list: {
        fontSize: 16,
        color: '#1e1e1e',
    },
    iconList: {
        fontSize: 24,
        marginRight: 10,
        color: '#1e1e1e',
    },
});

export default createAppContainer(DrawerNavigator);
