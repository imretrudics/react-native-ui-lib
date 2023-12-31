import isUndefined from 'lodash/isUndefined';
import React, { useMemo } from 'react';
import { Image, StyleSheet } from 'react-native';
import { asBaseComponent, Constants } from "../../commons/new";
import { getAsset, isSvg } from "../../utils/imageUtils";
import SvgImage from "../svgImage";

/**
 * @description: Icon component
 * @extends: Image
 * @extendsLink: https://reactnative.dev/docs/image
 */

const Icon = props => {
  const {
    size,
    tintColor,
    style,
    supportRTL,
    source,
    assetGroup,
    assetName,
    modifiers,
    ...others
  } = props;
  const {
    margins
  } = modifiers;
  const iconSize = size ? {
    width: size,
    height: size
  } : undefined;
  const shouldFlipRTL = supportRTL && Constants.isRTL;
  const iconSource = useMemo(() => {
    if (!isUndefined(assetName)) {
      return getAsset(assetName, assetGroup);
    }
    return source;
  }, [source, assetGroup, assetName]);
  return isSvg(source) ? <SvgImage data={source} {...props} /> : <Image {...others} source={iconSource} style={[style, margins, iconSize, shouldFlipRTL && styles.rtlFlipped, !!tintColor && {
    tintColor
  }]} />;
};
Icon.displayName = 'Icon';
Icon.defaultProps = {
  assetGroup: 'icons'
};
export default asBaseComponent(Icon, {
  modifiersOptions: {
    margins: true
  }
});
const styles = StyleSheet.create({
  rtlFlipped: {
    transform: [{
      scaleX: -1
    }]
  }
});