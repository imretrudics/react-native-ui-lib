/// <reference types="tinycolor2" />
import React, { Component } from 'react';
import { StyleProp, ViewStyle } from 'react-native';
interface SliderGroupProps {
    color: string;
    onValueChange: (color: string) => void;
    style?: StyleProp<ViewStyle>;
    children?: React.ReactNode;
}
interface SliderGroupState {
    value: tinycolor.ColorFormats.HSLA;
}
export default class SliderGroup extends Component<SliderGroupProps, SliderGroupState> {
    static displayName: string;
    constructor(props: SliderGroupProps);
    getContextProviderValue(): {
        value: import("tinycolor2").ColorFormats.HSLA;
        setValue: (value: import("tinycolor2").ColorFormats.HSLA) => void;
    };
    setValue: (value: tinycolor.ColorFormats.HSLA) => void;
    render(): React.JSX.Element;
}
export {};
