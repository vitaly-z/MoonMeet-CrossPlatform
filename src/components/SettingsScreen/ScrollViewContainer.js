import React, {useRef, useMemo, useCallback} from 'react';
import {Linking, Platform, View} from 'react-native';

import DataItemTitle from './DataItemTitle';
import DataItem from './DataItem';
import DataItemCustom from './DataItemCustom';

import EditIcon from '../../assets/images/create.png';
import DarkModeIcon from '../../assets/images/dark_mode.png';
import PassCodeIcon from '../../assets/images/pin.png';
import LogoutIcon from '../../assets/images/logout.png';
import PrivacyIcon from '../../assets/images/lock.png';
import NotificationsIcon from '../../assets/images/notifications.png';
import MessageIcon from '../../assets/images/chat.png';
import PriPoIcon from '../../assets/images/verified_shield.png';
import DevicesIcon from '../../assets/images/devices.png';
import UsernameIcon from '../../assets/images/email.png';
import ActiveStatusIcon from '../../assets/images/hdr.png';
import FAQIcon from '../../assets/images/quiz.png';
import ReportIcon from '../../assets/images/bug.png';

import {COLORS} from '../../config/Miscellaneous';
import {useNavigation} from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

import PrivacyPolicy from '../Modals/PrivacyPolicy/PrivacyPolicy';
import FrequentlyAskedQuestions from '../Modals/FrequentlyAskedQuestions/FrequentlyAskedQuestions';

import Clipboard from '@react-native-clipboard/clipboard';
import {ErrorToast, SuccessToast} from '../ToastInitializer/ToastInitializer';
import moment from 'moment';
import {useTheme} from 'react-native-paper';
import {ThemeContext} from '../../config/Theme/Context';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';

interface ScrollViewContainerInterface {
  firstName: string;
  lastName: string;
  username: string;
  avatar: string;
  userBio: string;
  activeStatus: string;
  activeTime: string;
}

const ScrollViewContainer = (props: ScrollViewContainerInterface) => {
  const privacyRef = useRef(null);
  const faqRef = useRef(null);
  const sheetSnapPoints = useMemo(() => ['80%', '100%'], []);

  const handlePresentPrivacyModal = useCallback(() => {
    faqRef?.current?.forceClose();
    privacyRef?.current?.present();
  }, []);

  const handlePresentFaqModal = useCallback(() => {
    privacyRef?.current?.forceClose();
    faqRef?.current?.present();
  }, []);

  const navigation = useNavigation();

  const theme = useTheme();
  const {toggleTheme, isThemeDark} = React.useContext(ThemeContext);

  const DevicesScreen = Platform.select({
    ios: () => (
      <DataItem
        leftIcon={DevicesIcon}
        leftIconColor={COLORS.amazingPurple}
        titleTextContainer={'Devices'}
        onPressTrigger={() => navigation?.navigate('devices')}
      />
    ),
    android: () => (
      <DataItem
        leftIcon={DevicesIcon}
        leftIconColor={COLORS.amazingPurple}
        titleTextContainer={'Devices'}
        onPressTrigger={() => navigation?.navigate('devices')}
      />
    ),
    default: () => undefined | null,
  });
  return (
    <View
      style={{
        backgroundColor: isThemeDark ? COLORS.primaryDark : COLORS.primaryLight,
      }}>
      <DataItemTitle titleItem={'Miscellaneous'} />
      <DataItemCustom
        leftIcon={DarkModeIcon}
        leftIconColor={COLORS.black}
        titleTextContainer={'Dark mode'}
        rippleColor={COLORS.rippleColor}
        imageSize={36.5}
        iconColor={COLORS.white}
        titleColor={isThemeDark ? COLORS.white : COLORS.black}
        enableDescription={true}
        descriptionText={'System'}
        descriptionColor={isThemeDark ? COLORS.white : COLORS.black}
        descriptionOpacity={0.4}
        onPressTrigger={() => {
          navigation?.navigate('darkMode');
        }}
        onLongPressTrigger={null}
      />
      <DataItemTitle titleItem={'Account'} />
      <DataItem
        leftIcon={EditIcon}
        leftIconColor={COLORS.purple}
        titleTextContainer={'Edit profile'}
        onPressTrigger={() => navigation.navigate('editProfile')}
      />
      <DataItem
        leftIcon={PassCodeIcon}
        leftIconColor={COLORS.green}
        titleTextContainer={'Setup passcode'}
        onPressTrigger={() => navigation.navigate('passcodeSetup')}
      />
      <DataItem
        leftIcon={PrivacyIcon}
        leftIconColor={COLORS.orange}
        titleTextContainer={'Privacy and Security'}
        onPressTrigger={null}
      />
      <DataItem
        leftIcon={LogoutIcon}
        leftIconColor={COLORS.redLightError}
        titleTextContainer={'Log out'}
        onPressTrigger={() => {
          try {
            auth()
              ?.signOut()
              .finally(() => {
                navigation?.navigate('login');
              });
          } catch (e) {
            console.error(e);
          }
        }}
      />
      <DataItemTitle titleItem={'Profile'} />
      <DataItemCustom
        leftIcon={ActiveStatusIcon}
        leftIconColor={COLORS.green}
        titleTextContainer={'Active Status'}
        rippleColor={COLORS.rippleColor}
        imageSize={36.5}
        iconColor={COLORS.white}
        titleColor={COLORS.black}
        enableDescription={true}
        descriptionText={
          props?.activeStatus === 'recently'
            ? 'Last seen recently'
            : moment(props?.activeTime)?.fromNow()
        }
        descriptionColor={COLORS.black}
        onPressTrigger={() => navigation?.navigate('activeStatus')}
        onLongPressTrigger={null}
      />
      <DataItemCustom
        leftIcon={UsernameIcon}
        leftIconColor={COLORS.redDarkError}
        titleTextContainer={'Username'}
        rippleColor={COLORS.rippleColor}
        imageSize={36.5}
        iconColor={COLORS.white}
        titleColor={COLORS.black}
        enableDescription={true}
        descriptionText={props?.username}
        descriptionColor={COLORS.black}
        onPressTrigger={() => navigation?.navigate('changeUsername')}
        onLongPressTrigger={() => {
          try {
            Clipboard?.setString(props?.username);
            SuccessToast(
              'bottom',
              'Copied!',
              'Your username is copied successfully to Clipboard',
              true,
              3000,
            );
          } catch (e) {
            ErrorToast(
              'bottom',
              'Error Copying!',
              'An error occurred when copying your username',
              true,
              3000,
            );
          }
        }}
      />
      <DataItemTitle titleItem={'Settings'} />
      <DataItem
        leftIcon={NotificationsIcon}
        leftIconColor={COLORS.yellowDarkWarning}
        titleTextContainer={'Notifications Settings'}
        onPressTrigger={() => Linking?.openSettings()}
      />
      <DataItem
        leftIcon={MessageIcon}
        leftIconColor={COLORS.blue_second}
        titleTextContainer={'Chat Settings'}
        onPressTrigger={null}
      />
      <DevicesScreen />
      <DataItemTitle titleItem={'Help'} />
      <DataItem
        leftIcon={PriPoIcon}
        leftIconColor={COLORS.maroon}
        titleTextContainer={'Privacy Policy'}
        onPressTrigger={() => handlePresentPrivacyModal()}
      />
      <DataItem
        leftIcon={FAQIcon}
        leftIconColor={COLORS.pink}
        titleTextContainer={'Frequently asked questions'}
        onPressTrigger={() => handlePresentFaqModal()}
      />
      <DataItem
        leftIcon={ReportIcon}
        leftIconColor={COLORS.accentLight}
        titleTextContainer={'Report technical problem'}
        onPressTrigger={() => navigation?.navigate('bugreport')}
      />
      <PrivacyPolicy
        sheetRef={privacyRef}
        index={0}
        snapPoints={sheetSnapPoints}
      />
      <FrequentlyAskedQuestions
        sheetRef={faqRef}
        index={0}
        snapPoints={sheetSnapPoints}
      />
    </View>
  );
};

export default ScrollViewContainer;
