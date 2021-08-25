import LeftBar from './LeftBar/LeftBar';
import Header from './Header/Header';
import Body from './Body/Body';
import Footer from './Footer/Footer';
import BackDrop from './BackDrop/BackDrop';
import { Navigatablecontainer } from '../../helper/Navigation';

const Menu = () => {
    return <Navigatablecontainer navigationID="mainmenu">
        <Header />
        <LeftBar />
        <Body />
        <BackDrop image="https://wallpaperaccess.com/full/1308706.jpg"/>
        <Footer />
    </Navigatablecontainer>
}

export default Menu