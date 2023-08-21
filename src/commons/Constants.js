import { Platform, Dimensions, NativeModules, I18nManager, AccessibilityInfo } from 'react-native';
export let orientations = /*#__PURE__*/function (orientations) {
  orientations["PORTRAIT"] = "portrait";
  orientations["LANDSCAPE"] = "landscape";
  return orientations;
}({});
const isAndroid = Platform.OS === 'android';
const isIOS = Platform.OS === 'ios';
const isWeb = Platform.OS === 'web';
let isTablet;
let statusBarHeight;
let screenHeight = Dimensions.get('screen').height;
let screenWidth = Dimensions.get('screen').width;
let windowHeight = Dimensions.get('window').height;
let windowWidth = Dimensions.get('window').width;

//@ts-ignore
isTablet = Platform.isPad || getAspectRatio() < 1.6 && Math.max(screenWidth, screenHeight) >= 900;
function setStatusBarHeight() {
  const {
    StatusBarManager
  } = NativeModules;
  statusBarHeight = StatusBarManager?.HEIGHT || 0; // So there will be a value for any case
  // statusBarHeight = isIOS ? 20 : StatusBarManager.HEIGHT;
  // if (isIOS) {
  //   // override guesstimate height with the actual height from StatusBarManager
  //   StatusBarManager.getHeight((data: any) => (statusBarHeight = data.height));
  // }
}

function getAspectRatio() {
  return screenWidth < screenHeight ? screenHeight / screenWidth : screenWidth / screenHeight;
}
function getOrientation(height, width) {
  return width < height ? orientations.PORTRAIT : orientations.LANDSCAPE;
}
export function updateConstants(dimensions) {
  screenHeight = dimensions.screen.height;
  screenWidth = dimensions.screen.width;
  windowWidth = dimensions.window.width;
  windowHeight = dimensions.window.height;
  setStatusBarHeight();
}
const accessibility = {
  isScreenReaderEnabled: false
};
function handleScreenReaderChanged(isScreenReaderEnabled) {
  accessibility.isScreenReaderEnabled = isScreenReaderEnabled;
}
AccessibilityInfo.addEventListener('screenReaderChanged', handleScreenReaderChanged);
function setAccessibility() {
  AccessibilityInfo.isScreenReaderEnabled().then(isScreenReaderEnabled => {
    accessibility.isScreenReaderEnabled = isScreenReaderEnabled;
  });
}
setAccessibility();
const constants = {
  /* Platform */
  orientations,
  isAndroid,
  isIOS,
  isWeb,
  getAndroidVersion: () => {
    return isAndroid ? parseInt(Platform.Version, 10) : undefined;
  },
  /* Navigation */
  get statusBarHeight() {
    return statusBarHeight;
  },
  /* Layout */
  isRTL: I18nManager.isRTL,
  get orientation() {
    return getOrientation(windowHeight, windowWidth);
  },
  get isLandscape() {
    return getOrientation(windowHeight, windowWidth) === orientations.LANDSCAPE;
  },
  get screenWidth() {
    return screenWidth;
  },
  get screenHeight() {
    return screenHeight;
  },
  get windowWidth() {
    return windowWidth;
  },
  get windowHeight() {
    return windowHeight;
  },
  get isSmallScreen() {
    return screenWidth <= 340;
  },
  get isShortScreen() {
    return screenHeight <= 600;
  },
  get screenAspectRatio() {
    return getAspectRatio();
  },
  get isTablet() {
    return isTablet;
  },
  set isTablet(value) {
    isTablet = value;
  },
  get isWideScreen() {
    return isTablet || this.isLandscape;
  },
  getSafeAreaInsets: () => {
    const orientation = getOrientation(screenHeight, screenWidth);
    return orientation === orientations.LANDSCAPE ? {
      left: 44,
      right: 44,
      bottom: 24,
      top: 0
    } : {
      left: 0,
      right: 0,
      bottom: 34,
      top: 44
    };
  },
  /* Devices */
  get isIphoneX() {
    return isIOS &&
    //@ts-ignore
    !Platform.isPad &&
    //@ts-ignore
    !Platform.isTVOS && (screenHeight >= 812 || screenWidth >= 812);
  },
  /* Orientation */
  addDimensionsEventListener: callback => {
    return Dimensions.addEventListener('change', callback);
  },
  /* Dimensions */
  removeDimensionsEventListener: callback => {
    if (callback.remove) {
      callback.remove();
    } else {
      Dimensions.removeEventListener('change', callback);
    }
  },
  /* Accessibility */
  get accessibility() {
    return accessibility;
  },
  /* Keyboard */
  backspaceKey: 'Backspace',
  enterKey: 'Enter'
};
setStatusBarHeight();
Dimensions.addEventListener('change', updateConstants);
export default constants;