import _get from "lodash/get";
import _toUpper from "lodash/toUpper";
import React, { PureComponent } from 'react';
import { LayoutAnimation, StyleSheet, Keyboard, TextInput, PixelRatio, I18nManager } from 'react-native';
import { Constants, asBaseComponent } from "../../commons/new";
import Assets from "../../assets";
import { Colors, Typography } from "../../style";
import View from "../view";
import Text from "../text";
import TouchableOpacity from "../touchableOpacity";
import Dialog from "../dialog";
import Button from "../button";
import ColorSliderGroup from "../slider/ColorSliderGroup";
import PanningProvider from "../panningViews/panningProvider";
const KEYBOARD_HEIGHT = 216;

/**
 * @description: A color picker dialog component
 * @extends: Dialog
 * @example: https://github.com/wix/react-native-ui-lib/blob/master/demo/src/screens/componentScreens/ColorPickerScreen.tsx
 */
class ColorPickerDialog extends PureComponent {
  static displayName = 'ColorPicker';
  static defaultProps = {
    initialColor: Colors.$backgroundNeutralLight
  };
  constructor(props) {
    super(props);
    const color = Colors.getHSL(props.initialColor);
    const text = this.getColorValue(props.initialColor);
    const {
      valid
    } = this.getValidColorString(text);
    this.state = {
      keyboardHeight: KEYBOARD_HEIGHT,
      color,
      text,
      valid
    };
  }
  textInput = React.createRef();
  //@ts-ignore

  //@ts-ignore

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this.keyboardDidShow);
    this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this.keyboardDidHide);
  }
  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }
  keyboardDidShow = e => {
    if (Constants.isIOS && this.state.keyboardHeight !== e.endCoordinates.height) {
      this.setState({
        keyboardHeight: e.endCoordinates.height
      });
    }
    // For down arrow button in Android keyboard
    this.changeHeight(0);
  };
  keyboardDidHide = () => {
    this.changeHeight(KEYBOARD_HEIGHT);
  };
  onFocus = () => {
    this.changeHeight(0);
  };
  setFocus = () => {
    this.textInput?.current?.focus();
  };
  changeHeight(height) {
    if (Constants.isAndroid && this.state.keyboardHeight !== height) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({
        keyboardHeight: height
      });
    }
  }
  getColorValue(color) {
    if (!color) {
      return;
    }
    return color.replace('#', '');
  }
  getHexColor(text) {
    if (!Colors.isTransparent(text)) {
      const trimmed = text.replace(/\s+/g, '');
      const hex = `#${trimmed}`;
      return hex;
    }
    return text;
  }
  getHexString(color) {
    return _toUpper(Colors.getHexString(color));
  }
  getTextColor(color) {
    return Colors.isDark(color) ? Colors.white : Colors.grey10;
  }
  getValidColorString(text) {
    if (text) {
      const hex = this.getHexColor(text);
      if (Colors.isValidHex(hex)) {
        return {
          hex,
          valid: true
        };
      }
    }
    return {
      undefined,
      valid: false
    };
  }
  applyColor = text => {
    const {
      hex,
      valid
    } = this.getValidColorString(text);
    if (hex) {
      this.setState({
        color: Colors.getHSL(hex),
        text,
        valid
      });
    } else {
      this.setState({
        text,
        valid
      });
    }
  };
  updateColor(color) {
    const hex = this.getHexString(color);
    const text = this.getColorValue(hex);
    this.setState({
      color,
      text,
      valid: true
    });
  }
  resetValues() {
    const {
      initialColor
    } = this.props;
    const color = Colors.getHSL(initialColor);
    const text = this.getColorValue(initialColor);
    const {
      valid
    } = this.getValidColorString(text);
    this.setState({
      color,
      text,
      valid
    });
  }
  onSliderValueChange = color => {
    this.updateColor(color);
  };
  onChangeText = value => {
    this.applyColor(value);
  };
  onDonePressed = () => {
    const {
      text
    } = this.state;
    const {
      hex
    } = this.getValidColorString(text);
    if (hex) {
      this.props.onSubmit?.(hex, this.getTextColor(hex));
      this.onDismiss();
    }
  };
  onDismiss = () => {
    this.resetValues();
    this.props.onDismiss?.();
  };
  renderHeader() {
    const {
      doneButtonColor,
      accessibilityLabels
    } = this.props;
    const {
      valid
    } = this.state;
    return <View row spread bg-white paddingH-20 style={styles.header}>
        <Button link iconSource={Assets.icons.x} iconStyle={{
        tintColor: Colors.$iconDefault
      }} onPress={this.onDismiss} accessibilityLabel={_get(accessibilityLabels, 'dismissButton')} />
        <Button color={doneButtonColor} disabled={!valid} link iconSource={Assets.icons.check} onPress={this.onDonePressed} accessibilityLabel={_get(accessibilityLabels, 'doneButton')} />
      </View>;
  }
  renderSliders() {
    const {
      keyboardHeight,
      color
    } = this.state;
    const colorValue = color.a === 0 ? Colors.$backgroundInverted : Colors.getHexString(color);
    return <ColorSliderGroup initialColor={colorValue} containerStyle={[styles.sliderGroup, {
      height: keyboardHeight
    }]} sliderContainerStyle={styles.slider} showLabels labelsStyle={styles.label} onValueChange={this.onSliderValueChange} accessible={false} />;
  }
  renderPreview() {
    const {
      accessibilityLabels,
      previewInputStyle
    } = this.props;
    const {
      color,
      text
    } = this.state;
    const hex = this.getHexString(color);
    const textColor = this.getTextColor(hex);
    const fontScale = PixelRatio.getFontScale();
    const value = Colors.isTransparent(text) ? '000000' : text;
    return <View style={[styles.preview, {
      backgroundColor: hex
    }]}>
        <TouchableOpacity center onPress={this.setFocus} activeOpacity={1} accessible={false}>
          <View style={styles.inputContainer}>
            <Text text60 white marginL-13 marginR-5={Constants.isIOS} style={{
            color: textColor,
            transform: [{
              scaleX: I18nManager.isRTL ? -1 : 1
            }]
          }} accessible={false}>
              #
            </Text>
            <TextInput ref={this.textInput} value={value} maxLength={6} numberOfLines={1} onChangeText={this.onChangeText} style={[styles.input, {
            color: textColor,
            width: value ? (value.length + 1) * 16.5 * fontScale : undefined
          }, Constants.isAndroid && {
            padding: 0
          }, previewInputStyle]} selectionColor={textColor} underlineColorAndroid="transparent" autoCorrect={false} autoComplete={'off'} autoCapitalize={'characters'}
          // keyboardType={'numbers-and-punctuation'} // doesn't work with `autoCapitalize`
          returnKeyType={'done'} enablesReturnKeyAutomatically onFocus={this.onFocus} accessibilityLabel={accessibilityLabels?.input} />
          </View>
          <View style={[{
          backgroundColor: textColor
        }, styles.underline]} />
        </TouchableOpacity>
      </View>;
  }
  renderDialog() {
    const {
      visible,
      dialogProps,
      testID
    } = this.props;
    return <Dialog visible={visible} //TODO: pass all Dialog props instead
    width="100%" bottom centerH onDismiss={this.onDismiss} containerStyle={styles.dialog} panDirection={PanningProvider.Directions.DOWN} testID={`${testID}.dialog`} supportedOrientations={['portrait', 'landscape', 'landscape-left', 'landscape-right']} // iOS only
    {...dialogProps}>
        {this.renderHeader()}
        {this.renderPreview()}
        {this.renderSliders()}
      </Dialog>;
  }
  render() {
    return this.renderDialog();
  }
}
export default asBaseComponent(ColorPickerDialog);
const BORDER_RADIUS = 12;
const styles = StyleSheet.create({
  dialog: {
    backgroundColor: Colors.$backgroundDefault,
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS
  },
  preview: {
    height: 200,
    alignItems: 'center',
    justifyContent: 'center'
  },
  header: {
    height: 56,
    borderTopLeftRadius: BORDER_RADIUS,
    borderTopRightRadius: BORDER_RADIUS,
    backgroundColor: Colors.$backgroundDefault
  },
  inputContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginBottom: Constants.isAndroid ? 5 : 8,
    transform: [{
      scaleX: I18nManager.isRTL ? -1 : 1
    }]
  },
  input: {
    ...Typography.text60,
    letterSpacing: 3,
    transform: [{
      scaleX: I18nManager.isRTL ? -1 : 1
    }]
  },
  underline: {
    height: 1.5,
    width: Constants.isAndroid ? 119 : 134,
    marginRight: Constants.isAndroid ? 13 : 8
  },
  sliderGroup: {
    paddingTop: 12,
    marginHorizontal: 20
  },
  slider: {
    marginBottom: 15,
    height: 26
  },
  label: {
    marginBottom: 3
  }
});