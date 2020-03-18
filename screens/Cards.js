import React, { Component } from 'react'
import { Text, StyleSheet, View, Dimensions, TextInput, FlatList, RefreshControl, TouchableNativeFeedback } from 'react-native'
import { Container, Header, Icon, Left, Right, Body, Button, Spinner, Item, Input, Form, Toast } from 'native-base'
import DB from '../database';

const MAIN_COLOR = '#39b772';
const HEADER_HEIGHT = 130;


export default class Items extends Component {
    _isMounted = false;
    
    constructor(props){
        super(props);
        this.state = {
            data: [],
            name_card: '',
            search: '',
            loading: false,
            showToast: false,
            isRefreshing: false
        }
        const {params} = this.props.navigation.state;
        this.board_id = params.board_id,
        this.name_board = params.name_board,
        this.searchHolder = [];
    }

    toastMessage = (message, type) => {
        Toast.show({
            text: message,
            duration: 500,
            type: type,
            buttonText: 'Close',
        });
    }

    componentDidMount(){
        this.setState({ loading: true });
        this.fetchData();
        //this.reloadData = this.props.navigation.addListener('didFocus', this.fetchData());
        this._isMounted = true;
    }

    componentWillUnmount(){
        this._isMounted = false;
    }

    fetchData = async () => {
        try {
            results = await DB.executeSql("SELECT * FROM cards WHERE board_id = ? ORDER BY id DESC", [this.board_id]);
            var len = results.rows.length;
            if(len > 0){
                var data = results.rows.raw();
                if(this._isMounted){
                    this.setState({data: data});
                    this.searchHolder = data;
                }
            }
            if(this._isMounted){
                this.setState({loading: false});
            }
        } catch (error) {
            console.log(error);
            this.toastMessage('Something Wrong','danger');
            if (this._isMounted) {
                this.setState({ loading: false });
            }
        }
    }

    handleAdd = async () => {
        const {name_card} = this.state;
        try {
            results = await DB.executeSql('INSERT INTO cards (name, board_id) VALUES (?,?)',[name_card, this.board_id]);
            console.log('Results', results.rowsAffected);
            if(results.rowsAffected > 0){
                if(this._isMounted){
                    this.setState({name_card:'',loading: false});
                }
                await this.fetchData();
            }
            else{
                this.toastMessage('Failed adding new card!','danger');
                if (this._isMounted) {
                    this.setState({ loading: false });
                }
            }
        } catch (error) {
            console.log(error);
            this.toastMessage('Something wrong','danger');
            if (this._isMounted) {
                this.setState({ loading: false });
            }
        }
    }

    handleSearch = () => {
        const searchData = this.searchHolder.filter(item => {      
            const itemData = `${item.name.toLowerCase()}`;
            const textData = this.state.name_card.toLowerCase();
            return itemData.indexOf(textData) > -1;    
        });
        if(this._isMounted){
            this.setState({ data: searchData });
        }
    }

    renderItem = ({ item, index }) => {
        if (item.empty === true) {
            return <View style={[styles.item, styles.itemInvisible]} />;
        }
        return (
            <View style={styles.item} >
                <TouchableNativeFeedback onPress={() => this.props.navigation.navigate('Detail', {card_id : item.id})}>
                    <View style={styles.itemContent}>
                        <Text style={styles.board}>{item.name ? item.name : ""}</Text>
                    </View>
                </TouchableNativeFeedback>
            </View>
        );
    };

    render() {
        return (
            <Container style={styles.container}>
                <View style={styles.head}>
                    <Header androidStatusBarColor='#34a869' noShadow style={styles.header}>
                        <Left>
                            <Button transparent onPress={() => this.props.navigation.navigate('Home')}>
                                <Icon name='md-arrow-back' style={styles.iconHeader} />
                            </Button>
                        </Left>
                        <Body/>
                        <Right>
                            <Button transparent onPress={() => this.props.navigation.push('AddBoard')}>
                                <Icon name='md-more' style={styles.iconHeader}/>
                            </Button>
                        </Right>
                    </Header>
                    <View style={{marginLeft: 40}}>
                        <Text style={styles.title}>{this.name_board}</Text>
                    </View>
                </View>
                <View style={styles.searchBar}>
                    <Item style={styles.search}>
                            <Icon name="md-search" style={[styles.icon, styles.searchIcon]}/>
                            <Input onChangeText={(text) => this._isMounted ? this.setState({name_card: text}) : null } value={this.state.name_card} 
                            placeholder="Search or Add" placeholderTextColor="#dddd"/>
                            {
                                this.state.name_card ?
                                <Button transparent onPress={this.handleAdd}>
                                    <Icon name="md-add" style={[styles.icon, styles.searchIcon]}/>
                                </Button>
                                : null
                            }
                    </Item>
                </View>
                {
                    this.state.loading ? <Spinner style={styles.spinner}/> :
                    <FlatList
                        data={this.state.data}
                        extraData={this.state}
                        //refreshing={this.state.isRefreshing}
                        //onRefresh={this.onRefresh}
                        ListEmptyComponent={
                            <View style={styles.blankSpace}>
                                <Text style={styles.blank}>Didn't find any data...</Text>
                                <Text style={styles.blank}>Add something above!</Text>
                            </View>
                        }
                        contentContainerStyle={styles.list}
                        renderItem={this.renderItem}
                        keyExtractor={item => item.id.toString()}
                        showsVerticalScrollIndicator={false}
                    />
                }
            </Container>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fafafa',
        flex:1
    },
    header: {
        backgroundColor: 'transparent'
    },
    head: {
        backgroundColor: MAIN_COLOR,
        // position: 'absolute',
        // top:0,
        // left:0,
        // right:0,
        height: HEADER_HEIGHT,
        //elevation: 1000,
        //zIndex: 50,
        //transform: [{ translateY: headerY }]
        //marginBottom: 20
    },
    list: {
        paddingTop: 40,
        padding: 15,
        backgroundColor: 'transparent'
    },
    titlePage: {
        //paddingBottom: 20
        //backgroundColor: '#39b772',
    }, 
    title: {
        fontSize: 27,
        fontWeight: 'bold',
        color: 'white'
    },
    subtitle: {
        fontSize: 14,
        fontWeight: 'normal',
        textAlign: 'center',
        color: 'white'
    },
    iconHeader: {
        color: 'white',
        fontSize: 27
    },
    icon: {
        color: '#a6a6a6',
        fontSize: 21
    },
    item: {
        backgroundColor: 'white',
        marginHorizontal: 10,
        marginVertical: 5,
        //padding: 15,
        borderRadius: 5,
        flex:1,
        elevation: 3,
        //height: Dimensions.get('window').width / numColumns
    },
    itemInvisible: {
        backgroundColor: 'transparent',
        elevation: 0
    },
    itemContent: {
        //height: Dimensions.get('window').width / numColumns,
        padding: 15
    },
    board: {
        fontSize: 16,
        fontWeight: '700',
        marginBottom: 10,
        color: '#1e1e1e'
    },
    description: {
        fontSize: 12,
        fontWeight: '300',
        color: '#5e5e5e'
    },
    spinner: {
        color: MAIN_COLOR,
        //flex:1,
        //paddingTop: HEADER_HEIGHT+50,
        position: 'absolute',
        top: Dimensions.get('window').height / 2,
        left:0,
        right:0,
        zIndex: 50,
    },
    blankSpace: {
        // position:'absolute',
        // top: 0,
        // left:0,
        // right:0,
        // zIndex: 100
        //backgroundColor: 'red',
        height: Dimensions.get('window').height / 2,
        justifyContent: 'center',
        alignContent: 'center',
    },
    blank: {
        //paddingTop: Dimensions.get('window').height / 2 - HEADER_HEIGHT ,
        textAlign: 'center',
        color: '#a5a5a5',
        fontSize: 16
    },
    searchBar: {
        //backgroundColor: 'red',
        //zIndex: 500,
        //marginTop: HEADER_HEIGHT - 25,
        //marginHorizontal: 40,
        position: 'absolute',
        top: HEADER_HEIGHT-25,
        left:40,
        right:40
        //justifyContent: 'center',
        //paddingHorizontal: 10,
        //borderRadius: 10
    },
    search: {
        backgroundColor: 'white',
        borderRadius: 10,
        elevation: 10
    },
    searchIcon: {
        paddingHorizontal: 10
    }

})