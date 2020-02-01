import React, { useState, useEffect, useCallback, useReducer } from 'react';
import {
  View,
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Platform,
  Alert
} from 'react-native';
import { HeaderButtons, Item } from 'react-navigation-header-buttons';
import { useSelector, useDispatch } from 'react-redux';

import HeaderButton from '../../components/UI/HeaderButton';
import * as productsActions from '../../store/actions/products';

const FORM_UPDATE = 'UPDATE';

const formReducer = (state, action) => {
  if (action.type === FORM_UPDATE) {
    const updatedValues = {
      ...state.values,
      [action.input]: action.value
    };

    const updatedValidation = {
      ...state.inputValidation,
      [action.input]: action.isValid
    };

    let updatedFormIsValid = true;
    for (const key in updatedValidation) {
      updatedFormIsValid = updatedFormIsValid && updatedValidation[key]
    }

    return {
      values: updatedValues,
      inputValidation: updatedValidation,
      formIsValid: updatedFormIsValid
    }
  }
  return state
};

const EditProductScreen = props => {
  const prodId = props.navigation.getParam('productId');
  const editedProduct = useSelector(state =>
    state.products.userProducts.find(prod => prod.id === prodId)
  );
  const dispatch = useDispatch();

  const [formState, formDispatch] = useReducer(formReducer, {
    values: {
      title: editedProduct ? editedProduct.title : '',
      imageUrl: editedProduct ? editedProduct.imageUrl : '',
      description: editedProduct ? editedProduct.description : '',
      price: ''
    },
    inputValidation: {
      title: !!editedProduct,
      imageUrl: !!editedProduct,
      description: !!editedProduct,
      price: !!editedProduct
    },
    formIsValid: !!editedProduct
  });

  const onChangeHandler = (input, text) => {
    let isValid = false;
    if (text.trim().length > 0) {
      isValid = true;
    }
    formDispatch({
      type: FORM_UPDATE,
      value: text,
      isValid: isValid,
      input: input
    })

  };

  const submitHandler = useCallback(() => {
    if (!formState.formIsValid) {
      Alert.alert(
        'Wrong input', 'Please check errors', [{text: 'Okay'}]
      );
      return;
    }
    if (editedProduct) {
      dispatch(
        productsActions.updateProduct(prodId, formState.values.title, formState.values.description, formState.values.imageUrl)
      );
    } else {
      dispatch(
        productsActions.createProduct(formState.values.title, formState.values.description, formState.values.imageUrl, +formState.values.price)
      );
    }
    props.navigation.goBack();
  }, [dispatch, prodId, formState]);

  useEffect(() => {
    props.navigation.setParams({submit: submitHandler});
  }, [submitHandler]);

  return (
    <ScrollView>
      <View style={styles.form}>
        <View style={styles.formControl}>
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={styles.input}
            value={formState.values.title}
            onChangeText={text => onChangeHandler('title', text)}
          />
          {!formState.values.title && <View><Text>Please review your title</Text></View>}
        </View>
        <View style={styles.formControl}>
          <Text style={styles.label}>Image URL</Text>
          <TextInput
            style={styles.input}
            value={formState.values.imageUrl}
            onChangeText={text => onChangeHandler('imageUrl', text)}
          />
        </View>
        {editedProduct ? null : (
          <View style={styles.formControl}>
            <Text style={styles.label}>Price</Text>
            <TextInput
              style={styles.input}
              value={formState.values.price}
              onChangeText={text => onChangeHandler('price', text)}
              keyboardType='decimal-pad'
            />
          </View>
        )}
        <View style={styles.formControl}>
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.input}
            value={formState.values.description}
            onChangeText={text => onChangeHandler('description', text)}
          />
        </View>
      </View>
    </ScrollView>
  );
};

EditProductScreen.navigationOptions = navData => {
  const submitFn = navData.navigation.getParam('submit');
  return {
    headerTitle: navData.navigation.getParam('productId')
      ? 'Edit Product'
      : 'Add Product',
    headerRight: (
      <HeaderButtons HeaderButtonComponent={HeaderButton}>
        <Item
          title="Save"
          iconName={
            Platform.OS === 'android' ? 'md-checkmark' : 'ios-checkmark'
          }
          onPress={submitFn}
        />
      </HeaderButtons>
    )
  };
};

const styles = StyleSheet.create({
  form: {
    margin: 20
  },
  formControl: {
    width: '100%'
  },
  label: {
    fontFamily: 'open-sans-bold',
    marginVertical: 8
  },
  input: {
    paddingHorizontal: 2,
    paddingVertical: 5,
    borderBottomColor: '#ccc',
    borderBottomWidth: 1
  }
});

export default EditProductScreen;
