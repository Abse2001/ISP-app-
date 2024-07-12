import { useState } from "react";
import {
  View,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { List, TextInput, Button, Icon } from "react-native-paper";
import { packege } from "./helpers/packege";
import { confirm } from "./helpers/confirm";
import * as Notifications from "expo-notifications";
export default function Modal() {
  const [text, setText] = useState("");
  // const [expanded, setExpanded] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(packege.limited[1]);
  // const handlePress = () => setExpanded(!expanded);
  const [checkCard, setCheckCard] = useState(true);
  const [balance, setBalance] = useState(0);
  const [cardNo, setCardNo] = useState("");
  const [valid, setValid] = useState(false);

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });
  return (
    <ScrollView className="w-full bg-[#fff] ">
      <View className="items-center  mb-9 justify-center">
        <View className="w-[95%] border-b-2 items-start justify-center flex-row  bg-[#ffffff] border-[#1D1D2E]">
          <Text className="text-[20px] py-[3%] text-center  font-bold text-[#1D1D2E]">
            تعبئة الرصيد
          </Text>
        </View>
        <View className="w-[90%] py-[5%]">
          <TextInput
            label="  Card Number"
            value={cardNo.toString()}
            onChange={(e) => {
              setCardNo(e.nativeEvent.text);
              if (e.nativeEvent.text.length == 8) setCheckCard(true);
              else setCheckCard(false);
            }}
            mode="outlined"
            className="bg-white my-6"
            activeOutlineColor="#C0091E"
            outlineStyle={{
              borderRadius: 20,
            }}
            outlineColor="#C4C4C4"
            placeholderTextColor="#C4C4C4"
            textColor="#0F0017"
            autoCapitalize="none"
            keyboardType="numeric"
            placeholder=" 1234 5678 9012 3456"
            maxLength={8}
            left={
              <TextInput.Icon icon="sort-numeric-variant" color="#C0091E" />
            }
          />
        </View>
        <View className="w-full justify-center items-center mt-6">
          <Text className="text-[16px] font-black text-[#1D1D2E]">
            الرصيد الحالي: <Text className="font-medium ">{balance} دينار</Text>
          </Text>
        </View>
        <View className="w-[100%] py-6  flex-row justify-around">
          <Button
            style={stylesType.box}
            mode="contained"
            labelStyle={{ color: "white" }}
            disabled={!checkCard}
            icon="currency-usd"
            className={` ${
              checkCard ? "bg-[#1D1D2E]" : "bg-[#9e9999]"
            }  text-white mb-[5%] w-[50%] rounded-xl`}
            onPress={async () => {
              if (cardNo == "") {
                Alert.alert("Error", "Please Enter Card Number");
                return;
              }
              const shouldContinue = await confirm(
                "Confirm",
                "Do you want to proceed?"
              );
              if (!shouldContinue) return;

              if (cardNo == "12345678" && shouldContinue) {
                await Notifications.scheduleNotificationAsync({
                  content: {
                    title: "Sela",
                    body: "You have added 10 LYD 💰",

                    sound: Platform.OS === "android" ? undefined : "default",
                  },
                  trigger: {
                    seconds: 1,
                  },
                });
                setBalance((prev) => prev + 10);
              } else {
                Alert.alert("Error", "Invalid Card Number");
              }
            }}
          >
            اضافة رصيد
          </Button>
        </View>
        <View className="w-[95%] mt-[5%] border-b-2 bg-[#ffffff] border-[#1D1D2E]">
          <Text className="text-[20px] py-[3%] text-center  font-bold text-[#1D1D2E]">
            إدارة الباقات
          </Text>
        </View>
        <View className="w-full flex-row justify-center items-center mt-[6%]">
          <View className="w-[75%]  justify-between items-center">
            <Text className="text-[16px] font-bold text-[#1D1D2E]">
              الباقة:{" "}
              <Text className="font-semibold ">
                {selectedPackage.name},
                <Text className={valid ? "text-green-500" : "text-red-500"}>
                  {" "}
                  {valid ? "صالحة" : "منتهية"}
                </Text>
              </Text>
            </Text>
            <Button
              style={stylesType.box}
              labelStyle={{ color: "white" }}
              mode="contained"
              icon="autorenew"
              className="bg-[#1D1D2E] text-white mt-4 w-[70%] rounded-xl"
              onPress={async () => {
                if (valid) {
                  Alert.alert(
                    "Valid Package",
                    "You already have a valid package."
                  );
                  return;
                } else {
                  if (selectedPackage.price > balance) {
                    Alert.alert(
                      "Insufficient Balance",
                      "You don't have enough balance to renew the package."
                    );
                    return;
                  } else {
                    const shouldContinue = await confirm(
                      "Renew Package🔂",
                      "Do you want to renew current package?"
                    );
                    if (shouldContinue) {
                      setValid(true);
                      setBalance(balance - selectedPackage.price);
                      await Notifications.scheduleNotificationAsync({
                        content: {
                          title: "Success ✅",
                          body: "Package Renewed",
                          data: {
                            data: "goes here",
                            test: { test1: "more data" },
                          },
                        },
                        trigger: { seconds: 0.1 },
                      });
                    }
                    if (!shouldContinue) {
                      return;
                    }
                  }
                }
              }}
            >
              تجديد الباقة الحالية
            </Button>
          </View>
        </View>
        <View className="w-full justify-center pt-[3%] items-center">
          <View className="w-[90%] py-3">
            <Text className="text-[14px] text-right font-medium text-[#C0091E]">
              تغيير الباقة
            </Text>
          </View>

          <View className="w-[90%] py-3">
            <View className="w-full">
              <List.Accordion
                title="الباقات المحدودة"
                style={{
                  backgroundColor: "#fff",
                  borderBottomWidth: 1,
                  borderColor: "#C0091E",
                  width: "100%",
                }}
                titleStyle={{ color: "#1D1D2E", textAlign: "right" }}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon="car-speed-limiter"
                    color="#C0091E"
                  />
                )}
              >
                {packege.limited.map((item, index) => (
                  <List.Accordion
                  
                    key={index}
                    style={{ backgroundColor: "#fff" }}
                    title={item.name}
                    titleStyle={{ color: "#1D1D2E" }}
                    left={(props) => (
                      <List.Icon
                        {...props}
                        icon="page-next-outline"
                        color="#C0091E"
                      />
                    )}
                  >
                    <View
                      style={stylesType.box}
                      className="w-[100%] border-2 bg-[#fff] rounded-xl my-2 border-[#C4C4C4] flex-col"
                    >
                      <View className="w-[100%] -ml-4 flex-row justify-around">
                        <Text className="text-sm pt-4  text-[#1D1D2E]">
                          Quota: {item.quota}
                        </Text>
                        <Text className="text-sm pt-4  text-[#1D1D2E]">
                          Price: {item.price} LYD
                        </Text>
                      </View>
                      <View className="w-[100%] -ml-4 flex-row justify-around">
                        <Text className="text-sm pt-4  text-[#1D1D2E]">
                          Download: {item.speedupLoading}
                        </Text>
                        <Text className="text-sm pt-4  text-[#1D1D2E]">
                          Upload: {item.speedupDownload}
                        </Text>
                      </View>
                      <View className=" w-[100%] -ml-4 flex-row justify-around">
                        <Text className="text-sm pt-4  text-[#1D1D2E]">
                          Duration: {item.duration} days
                        </Text>
                      </View>
                      <View className="w-[100%] py-3 -ml-4 flex-row justify-around">
                        <Button
                          style={stylesType.box}
                          labelStyle={{ color: "white" }}
                          mode="contained"
                          icon="cash-check"
                          className={`${
                            balance >= item.price
                              ? "bg-[#1D1D2E]"
                              : "bg-[#9e9999]"
                          } text-white w-[50%]  rounded-lg`}
                          onPress={async () => {
                            let massage =
                              "Change Package to" + item.name + "❔";
                            let title = "confirmation";
                            if (item.name != selectedPackage.name && valid)
                              massage =
                                "You will lose your current Active package❗";
                            if (item.name != selectedPackage.name && !valid) {
                              title = "confirmation";
                              massage = "Change Package to" + item.name + "❔";
                            }
                            title = "Warning ⚠️";

                            if (balance >= item.price) {
                              const shouldContinue = await confirm(
                                title,
                                massage
                              );
                              if (shouldContinue) {
                                setSelectedPackage(item);
                                setValid(true);
                                Alert.alert(
                                  "Success",
                                  "Package changed successfully!"
                                );
                                setBalance(balance - item.price);
                              } else return;
                            }
                            if (balance < item.price) {
                              Alert.alert("Error", "Insufficient balance!");
                              return;
                            }
                          }}
                        >
                          Select
                        </Button>
                      </View>
                    </View>
                  </List.Accordion>
                ))}
              </List.Accordion>
            </View>
            <List.Accordion
              title="الباقات الغير محدودة"
              style={{
                backgroundColor: "#fff",
                borderBottomWidth: 1,
                borderColor: "#C0091E",
              }}
              titleStyle={{ color: "#1D1D2E", textAlign: "right" }}
              left={(props) => (
                <List.Icon {...props} icon="infinity" color="#C0091E" />
              )}
            >
              {packege.unlimited.map((item, index) => (
                <List.Accordion
                  key={index}
                  style={{ backgroundColor: "#fff" }}
                  title={item.name}
                  titleStyle={{ color: "#1D1D2E" }}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon="page-next-outline"
                      color="#C0091E"
                    />
                  )}
                >
                  <View
                    style={stylesType.box}
                    className="w-[100%] border-2 bg-[#fff] rounded-xl my-2 border-[#C4C4C4] flex-col"
                  >
                    <View className="w-[100%] -ml-4 flex-row justify-around">
                      <Text className="text-sm pt-4  text-[#1D1D2E]">
                        Quota: {item.quota}
                      </Text>
                      <Text className="text-sm pt-4  text-[#1D1D2E]">
                        Price: {item.price} LYD
                      </Text>
                    </View>
                    <View className="w-[100%] -ml-4 flex-row justify-around">
                      <Text className="text-sm pt-4  text-[#1D1D2E]">
                        Download: {item.speedupLoading}
                      </Text>
                      <Text className="text-sm pt-4  text-[#1D1D2E]">
                        Upload: {item.speedupDownload}
                      </Text>
                    </View>
                    <View className=" w-[100%] -ml-4 flex-row justify-around">
                      <Text className="text-sm pt-4  text-[#1D1D2E]">
                        Duration: {item.duration} days
                      </Text>
                    </View>
                    <View className="w-[100%] py-3 -ml-4 flex-row justify-around">
                      <Button
                        style={stylesType.box}
                        labelStyle={{ color: "white" }}
                        mode="contained"
                        icon="cash-check"
                        className={`${
                          balance >= item.price
                            ? "bg-[#1D1D2E]"
                            : "bg-[#9e9999]"
                        } text-white w-[50%]  rounded-lg`}
                        onPress={async () => {
                          let massage = "Change Package to" + item.name + "❔";
                          let title = "confirmation";
                          if (item.name != selectedPackage.name && valid)
                            massage =
                              "You will lose your current Active package❗";
                          if (item.name != selectedPackage.name && !valid) {
                            title = "confirmation";
                            massage = "Change Package to" + item.name + "❔";
                          }
                          title = "Warning ⚠️";

                          if (balance >= item.price) {
                            const shouldContinue = await confirm(
                              title,
                              massage
                            );
                            if (shouldContinue) {
                              setSelectedPackage(item);
                              setValid(true);
                              Alert.alert(
                                "Success",
                                "Package changed successfully!"
                              );
                              setBalance(balance - item.price);
                            } else return;
                          }
                          if (balance < item.price) {
                            Alert.alert("Error", "Insufficient balance!");
                            return;
                          }
                        }}
                      >
                        Select
                      </Button>
                    </View>
                  </View>
                </List.Accordion>
              ))}
            </List.Accordion>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  box: {
    shadowColor: "rgba(0, 0, 0, 1)",
    shadowOpacity: 0.7,
    shadowRadius: 1.3,
    shadowOffset: {
      height: 1,
      width: 1,
    },
  },
});
const stylesType: StyleSheet.NamedStyles<any> = styles;
