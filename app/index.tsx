import CustomKeyboardAwareScrollView from "@/components/CustomKeyboardAwareScrollView";
import { useState } from "react";
import { Text, TextInput, View } from "react-native";
import {
  KeyboardAwareScrollView,
  KeyboardGestureArea,
  KeyboardStickyView,
} from "react-native-keyboard-controller";

function Example1() {
  const [text, setText] = useState("");
  return (
    <View
      style={{
        flex: 1,
      }}
    >
      <CustomKeyboardAwareScrollView
        keyboardDismissMode="interactive"
        style={{ borderWidth: 1, borderColor: "red" }}
      >
        {Array.from({ length: 20 }).map((_, index) => (
          <Text key={index}>Bla bla bla</Text>
        ))}
        <TextInput
          placeholder="Enter your text"
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
          }}
          multiline={true}
          scrollEnabled={false}
          value={text}
          onChangeText={setText}
        />
        {Array.from({ length: 20 }).map((_, index) => (
          <Text key={index}>Bla bla bla</Text>
        ))}
      </CustomKeyboardAwareScrollView>
      <KeyboardStickyView>
        <View
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
          }}
        >
          <Text>Testing Sticky Toolbar</Text>
        </View>
      </KeyboardStickyView>
    </View>
  );
}

function Example2() {
  const [text, setText] = useState("");
  return (
    <KeyboardGestureArea
      style={{ flex: 1 }}
      textInputNativeID="textInput"
      offset={80}
    >
      <KeyboardAwareScrollView
        keyboardDismissMode="interactive"
        style={{ borderWidth: 1, borderColor: "red" }}
      >
        {Array.from({ length: 20 }).map((_, index) => (
          <Text key={index}>Bla bla bla</Text>
        ))}
        <TextInput
          placeholder="Enter your text"
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
          }}
          multiline={true}
          scrollEnabled={false}
          value={text}
          onChangeText={setText}
          nativeID="textInput"
        />
        <TextInput
          placeholder="Enter your text"
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
          }}
          multiline={true}
          scrollEnabled={false}
          value={text}
          onChangeText={setText}
          nativeID="textInput"
        />
        {Array.from({ length: 20 }).map((_, index) => (
          <Text key={index}>Bla bla bla</Text>
        ))}
      </KeyboardAwareScrollView>
      <KeyboardStickyView>
        <View
          style={{
            borderWidth: 1,
            padding: 10,
            borderRadius: 5,
            height: 80,
          }}
        >
          <Text>Testing Sticky Toolbar</Text>
        </View>
      </KeyboardStickyView>
    </KeyboardGestureArea>
  );
}

export default Example2;
