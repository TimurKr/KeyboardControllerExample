import React from "react";
import { ScrollViewProps, StyleProp, ViewStyle } from "react-native";
import {
  useFocusedInputHandler,
  useReanimatedFocusedInput,
  useReanimatedKeyboardAnimation,
} from "react-native-keyboard-controller";
import Animated, {
  measure,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";

interface KeyboardAwareScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

const CustomKeyboardAwareScrollView: React.FC<KeyboardAwareScrollViewProps> = ({
  children,
  contentContainerStyle,
  ...props
}) => {
  const scrollViewRef = useAnimatedRef<Animated.ScrollView>();
  const scrollViewLayoutHeight = useSharedValue(0);

  const scrollOffsetY = useSharedValue(0);

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollOffsetY.value = event.contentOffset.y;
  });

  const { height: keyboardHeight } = useReanimatedKeyboardAnimation();

  const { input } = useReanimatedFocusedInput();
  const selection = useSharedValue<{
    start: { y: number };
    end: { y: number };
  } | null>(null);

  useAnimatedReaction(
    () => ({
      selectionTop: selection.value?.start.y,
      selectionBottom: selection.value?.end.y,
      inputTop: input.value?.layout.y,
      inputHeight: input.value?.layout.height,
      keyboardHeight: keyboardHeight.value,
    }),
    (newValue, previousValue) => {
      if (newValue.selectionTop && newValue.selectionTop < 0) {
        console.log("selectionTop is less than 0, a bug fix");
        return;
      }
      if (
        !newValue.selectionTop ||
        !newValue.selectionBottom ||
        !newValue.inputTop ||
        !newValue.inputHeight
      ) {
        console.log("some data is not defined");
        return;
      }

      if (
        newValue.selectionTop === previousValue?.selectionTop &&
        newValue.selectionBottom === previousValue?.selectionBottom &&
        newValue.inputTop === previousValue?.inputTop &&
        newValue.inputHeight === previousValue?.inputHeight &&
        newValue.keyboardHeight === previousValue?.keyboardHeight
      ) {
        console.log("no change");
        return;
      }

      if (keyboardHeight.value === 0) {
        console.log("height is 0");
        return;
      }

      if (newValue.keyboardHeight > (previousValue?.keyboardHeight ?? 0)) {
        console.log("keyboard height decreased");
        return;
      }

      const scrollViewLayout = measure(scrollViewRef);

      if (!scrollViewLayout) {
        console.log("scrollViewLayoutHeight is not defined");
        return;
      }

      const PADDING = 50;

      const topDiff =
        newValue.inputTop +
        newValue.selectionTop -
        scrollOffsetY.value -
        PADDING;

      const ignoreTop =
        newValue.selectionTop === previousValue?.selectionTop &&
        newValue.selectionBottom !== previousValue?.selectionBottom;

      const bottomDiff =
        scrollViewLayout.height -
        (newValue.inputTop + newValue.selectionBottom - scrollOffsetY.value) -
        PADDING;

      const ignoreBottom =
        newValue.selectionBottom === previousValue?.selectionBottom &&
        newValue.selectionTop !== previousValue?.selectionTop;

      console.log(`
        ---------- onSelectionChange start ----------
        scrollOffsetY:                    ${scrollOffsetY.value}
        inputTop:                         ${newValue.inputTop}
        selectionTop:                     ${newValue.selectionTop}
        topDiff:                          ${topDiff}

        scrollViewLayoutHeight:           ${scrollViewLayout.height}
        inputTop:                         ${newValue.inputTop}
        selectionBottom:                  ${newValue.selectionBottom}
        scrollOffsetY:                    ${scrollOffsetY.value}
        bottomDiff:                       ${bottomDiff}

        ignoreTop:                        ${ignoreTop}
        ignoreBottom:                     ${ignoreBottom}

        keyboardHeight:                   ${keyboardHeight.value}
        ---------   onSelectionChange end   ---------
      `);

      if (topDiff < 0 && !ignoreTop) {
        scrollTo(scrollViewRef, 0, scrollOffsetY.value + topDiff, true);
      }

      if (bottomDiff < 0 && !ignoreBottom) {
        scrollTo(scrollViewRef, 0, scrollOffsetY.value - bottomDiff, true);
      }
    },
    [keyboardHeight, scrollViewLayoutHeight, scrollOffsetY, input]
  );

  useFocusedInputHandler(
    {
      onSelectionChange: ({ selection: newSelection, target }) => {
        "worklet";
        selection.value = newSelection;
      },
    },
    [scrollViewLayoutHeight, keyboardHeight, scrollOffsetY, input]
  );

  const view = useAnimatedStyle(() => {
    return {
      paddingBottom: -keyboardHeight.value,
      borderWidth: 1,
      borderColor: "orange",
    };
  });

  return (
    <>
      <Animated.ScrollView
        ref={scrollViewRef}
        contentContainerStyle={contentContainerStyle}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        keyboardShouldPersistTaps="handled"
        {...props}
      >
        {children}
      </Animated.ScrollView>
      <Animated.View style={view} />
    </>
  );
};

export default CustomKeyboardAwareScrollView;
