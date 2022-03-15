import Colors from 'Theme/Colors'

const Commons = {
    textInput: {
        borderWidth: 1,
        borderColor: Colors.text,
        backgroundColor: Colors.inputBackground,
        color: Colors.text,
        minHeight: 50,
        textAlign: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    basicShadow: {
        boxShadow: "2px 7px 7px #9E9E9E"
    },
    basicPage: {
        display: 'flex',
        flex: 1,
        width: '100%',
        flexDirection: 'column',
        // paddingHorizontal: 15,
        backgroundColor: Colors.background,
    },
}

export default Commons
