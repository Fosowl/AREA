import FontsTypes from 'Theme/FontsTypes'
import { FontSize } from 'Theme/FontSize'
import Colors from 'Theme/Colors'

const Fonts = {
    textSmall: {
        fontFamily: FontsTypes.type.base,
        fontSize: FontSize.small,
        color: Colors.text,
    },
    textRegular: {
        fontFamily: FontsTypes.type.base,
        fontSize: FontSize.regular,
        color: Colors.text,
    },
    textLarge: {
        fontFamily: FontsTypes.type.bold,
        fontSize: FontSize.large,
        color: Colors.text,
    },
    titleSmall: {
        fontSize: FontSize.small * 2,
        fontWeight: 'bold',
        color: Colors.text,
    },
    titleRegular: {
        fontSize: FontSize.regular * 2,
        fontWeight: 'bold',
        color: Colors.text,
    },
    titleLarge: {
        fontSize: FontSize.large * 2,
        fontWeight: 'bold',
        color: Colors.text,
    },
    textCenter: {
        textAlign: 'center',
    },
    textJustify: {
        textAlign: 'justify',
    },
    textLeft: {
        textAlign: 'left',
    },
    textRight: {
        textAlign: 'right',
    },
}

export default Fonts
