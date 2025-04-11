import { View, Text, Pressable, TextInput } from 'react-native'
import React from 'react'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { useForm, Controller } from "react-hook-form";

type RegisterNavigationProp = NavigationProp<{ Login: undefined }>;

interface IFormInput {
    fullname: string;
    email: string;
    password: string;
    tramCondition: boolean;
}

export default function Register() {
    const navigation = useNavigation<RegisterNavigationProp>()

    const { control, handleSubmit } = useForm<IFormInput>({
        defaultValues: {
            fullname: "",
            email: "",
            password: "",
            tramCondition: false,
        }
    });


    function onSubmit(data) {
        console.log(data)
    }


    return (
        <View>
            <Controller control={control} render={({ field: { value, onChange } }) => (
                <TextInput value={value} onChangeText={onChange} />
            )} name="fullname" />

            <Controller control={control} render={({ field: { value, onChange } }) => (
                <TextInput value={value} onChangeText={onChange} />
            )} name="email" />

            <Controller control={control} render={({ field: { value, onChange } }) => (
                <TextInput value={value} onChangeText={onChange} />
            )} name="password" />

            <Pressable onPress={() => handleSubmit(onSubmit)}> <Text>Submit</Text> </Pressable>
        </View>
    )
}
