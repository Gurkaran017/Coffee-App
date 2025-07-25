import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  ToastAndroid,
} from 'react-native';
import React, { useEffect, useRef, useState , useCallback} from 'react'
import { useStore } from '../store/store'
import {useBottomTabBarHeight} from '@react-navigation/bottom-tabs';
import {
  BORDERRADIUS,
  COLORS,
  FONTFAMILY,
  FONTSIZE,
  SPACING,
} from '../theme/theme';
import HeaderBar from '../components/HeaderBar';
import CustomIcon from '../components/CustomIcon';
import {FlatList} from 'react-native';
import CoffeeCard from '../components/CoffeeCard';
import {Dimensions} from 'react-native';
import {
  CopilotStep,
  walkthroughable,
  useCopilot,
} from 'react-native-copilot';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppState } from 'react-native';
import { useTheme } from 'react-native-paper';

const CopilotView = walkthroughable(View);

const getCategoriesFromData = (data: any) => {
  let temp: any = {};
  for (let i = 0; i < data.length; i++) {
    if (temp[data[i].name] == undefined) {
      temp[data[i].name] = 1;
    } else {
      temp[data[i].name]++;
    }
  }
  let categories = Object.keys(temp);
  categories.unshift('All');
  return categories;
};

const getCoffeeList = (category: string, data: any) => {
  if (category == 'All') {
    return data;
  } else {
    let coffeelist = data.filter((item: any) => item.name == category);
    return coffeelist;
  }
};

const HomeScreen = ({navigation} : any ) => {
  const { colors } = useTheme();
  const CoffeeList = useStore((state: any) => state.CoffeeList);
  const BeanList = useStore((state: any) => state.BeanList);
  const addToCart = useStore((state: any) => state.addToCart);
  const calculateCartPrice = useStore((state: any) => state.calculateCartPrice);

  const [categories, setCategories] = useState(
    getCategoriesFromData(CoffeeList),
  );
  const [searchText, setSearchText] = useState('');
  const [categoryIndex, setCategoryIndex] = useState({
    index: 0,
    category: categories[0],
  });
  const [sortedCoffee, setSortedCoffee] = useState(
    getCoffeeList(categoryIndex.category, CoffeeList),
  );

  const ListRef = useRef<FlatList<any>>(null);
  const tabBarHeight = useBottomTabBarHeight()

  const searchCoffee = (search: string) => {
    if (search != '') {
      ListRef?.current?.scrollToOffset({
        animated: true,
        offset: 0,
      });
      setCategoryIndex({index: 0, category: categories[0]});
      setSortedCoffee([
        ...CoffeeList.filter((item: any) =>
          item.name.toLowerCase().includes(search.toLowerCase()),
        ),
      ]);
    }
  };

  const resetSearchCoffee = () => {
    ListRef?.current?.scrollToOffset({
      animated: true,
      offset: 0,
    });
    setCategoryIndex({index: 0, category: categories[0]});
    setSortedCoffee([...CoffeeList]);
    setSearchText('');
  };

  const CoffeCardAddToCart = ({
    id,
    index,
    name,
    roasted,
    imagelink_square,
    special_ingredient,
    type,
    prices,
  }: any) => {
    addToCart({
      id,
      index,
      name,
      roasted,
      imagelink_square,
      special_ingredient,
      type,
      prices,
    });
    calculateCartPrice();
    ToastAndroid.showWithGravity(
      `${name} is Added to Cart`,
      ToastAndroid.SHORT,
      ToastAndroid.CENTER,
    );
  }

  return (
    <View style={[styles.ScreenContainer, { backgroundColor: colors.background }]}>
      <StatusBar backgroundColor={COLORS.primaryBlackHex} />
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.ScrollViewFlex}>
        {/* App Header */}
        <HeaderBar />
        <Text style={[styles.ScreenTitle, { color: colors.onBackground }]}>
          Find the best{'\n'}coffee for you
        </Text>

        {/* Search Input */}
        <CopilotStep 
  text={`🔍 Smart Search Bar\n\n• Type any coffee name or ingredient\n• Instantly find your perfect match\n• Try searching for 'Arabica' or 'Espresso'!`} 
  order={1} 
  name="searchBar"
>

          <CopilotView style={[styles.InputContainerComponent, { backgroundColor: colors.surface }]}>
            <TouchableOpacity
              onPress={() => {
                searchCoffee(searchText);
              }}>
              <CustomIcon
                style={styles.InputIcon}
                name="search"
                size={FONTSIZE.size_18}
                color={
                  searchText.length > 0
                    ? COLORS.primaryOrangeHex
                    : COLORS.primaryLightGreyHex
                }
              />
            </TouchableOpacity>
            <TextInput
              placeholder="Find Your Coffee..."
              value={searchText}
              onChangeText={text => {
                setSearchText(text);
                searchCoffee(text);
              }}
              placeholderTextColor={COLORS.primaryLightGreyHex}
              style={[styles.TextInputContainer, { color: colors.onSurface }]}
            />
            {searchText.length > 0 ? (
              <TouchableOpacity
                onPress={() => {
                  resetSearchCoffee();
                }}>
                <CustomIcon
                  style={styles.InputIcon}
                  name="close"
                  size={FONTSIZE.size_16}
                  color={COLORS.primaryLightGreyHex}
                />
              </TouchableOpacity>
            ) : (
              <></>
            )}
          </CopilotView>
        </CopilotStep>

        {/* Category Scroller */}
        <CopilotStep 
  text={`📂 Coffee Categories\n\n• Easily filter your coffee selection\n• Choose from types like Americano, Black Coffee, or Cappuccino\n• Helps you explore specific flavors faster!`} 
  order={2} 
  name="categorySelector"
>

  <CopilotView>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.CategoryScrollViewStyle}>
          {categories.map((data, index) => (
            <View
              key={index.toString()}
              style={styles.CategoryScrollViewContainer}>
              <TouchableOpacity
                style={styles.CategoryScrollViewItem}
                onPress={() => {
                  ListRef?.current?.scrollToOffset({
                    animated: true,
                    offset: 0,
                  });
                  setCategoryIndex({index: index, category: categories[index]});
                  setSortedCoffee([
                    ...getCoffeeList(categories[index], CoffeeList),
                  ]);
                }}>
                <Text
                  style={[
                    styles.CategoryText,
                    categoryIndex.index == index
                      ? {color: COLORS.primaryOrangeHex}
                      : {},
                  ]}>
                  {data}
                </Text>
                {categoryIndex.index == index ? (
                  <View style={styles.ActiveCategory} />
                ) : (
                  <></>
                )}
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
        </CopilotView>
        </CopilotStep>

        {/* Coffee Flatlist */}
        <CopilotStep 
  text={`☕ Premium Coffee Collection\n\n• Browse our premium coffee selection\n• Tap a card for details, ratings, and tips\n• Discover your next favorite brew!`} 
  order={3} 
  name="coffeeList"
>

          <CopilotView>
            <FlatList
              ref={ListRef}
              horizontal
              ListEmptyComponent={
                <View style={styles.EmptyListContainer}>
                  <Text style={styles.CategoryText}>No Coffee Available</Text>
                </View>
              }
              showsHorizontalScrollIndicator={false}
              data={sortedCoffee}
              contentContainerStyle={styles.FlatListContainer}
              keyExtractor={item => item.id}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push('Details', {
                        index: item.index,
                        id: item.id,
                        type: item.type,
                      });
                    }}>
                    <CoffeeCard
                      id={item.id}
                      index={item.index}
                      type={item.type}
                      roasted={item.roasted}
                      imagelink_square={item.imagelink_square}
                      name={item.name}
                      special_ingredient={item.special_ingredient}
                      average_rating={item.average_rating}
                      price={item.prices[2]}
                      buttonPressHandler={CoffeCardAddToCart}
                    />
                  </TouchableOpacity>
                );
              }}
            />
          </CopilotView>
        </CopilotStep>

        <Text style={[styles.CoffeeBeansTitle, { color: colors.onSurface }]}>Coffee Beans</Text>

        {/* Beans Flatlist */}
       <CopilotStep 
  text={`🌱 Fresh Coffee Beans\n\n• Explore beans from around the world\n• Perfect for home brewing\n• Enjoy the freshest experience!`} 
  order={4} 
  name="beanList"
>

          <CopilotView>
            <FlatList
              horizontal
              showsHorizontalScrollIndicator={false}
              data={BeanList}
              contentContainerStyle={[
                styles.FlatListContainer,
                {marginBottom: tabBarHeight},
              ]}
              keyExtractor={item => item.id}
              renderItem={({item}) => {
                return (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.push('Details', {
                        index: item.index,
                        id: item.id,
                        type: item.type,
                      });
                    }}>
                    <CoffeeCard
                      id={item.id}
                      index={item.index}
                      type={item.type}
                      roasted={item.roasted}
                      imagelink_square={item.imagelink_square}
                      name={item.name}
                      special_ingredient={item.special_ingredient}
                      average_rating={item.average_rating}
                      price={item.prices[2]}
                      buttonPressHandler={CoffeCardAddToCart}
                    />
                  </TouchableOpacity>
                );
              }}
            />
          </CopilotView>
        </CopilotStep>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  ScreenContainer: {
    flex: 1,
    backgroundColor: COLORS.primaryBlackHex,
    paddingTop:20
  },
  ScrollViewFlex: {
    flexGrow: 1,
  },
  ScreenTitle: {
    fontSize: FONTSIZE.size_28,
    fontFamily: FONTFAMILY.poppins_semibold,
    color: COLORS.primaryWhiteHex,
    paddingLeft: SPACING.space_30,
  },
  InputContainerComponent: {
    flexDirection: 'row',
    margin: SPACING.space_30,
    borderRadius: BORDERRADIUS.radius_20,
    backgroundColor: COLORS.primaryDarkGreyHex,
    alignItems: 'center',
  },
  InputIcon: {
    marginHorizontal: SPACING.space_20,
  },
  TextInputContainer: {
    flex: 1,
    height: SPACING.space_20 * 3,
    fontFamily: FONTFAMILY.poppins_medium,
    fontSize: FONTSIZE.size_14,
    color: COLORS.primaryWhiteHex,
  },
  CategoryScrollViewStyle: {
    paddingHorizontal: SPACING.space_20,
    marginBottom: SPACING.space_20,
  },
  CategoryScrollViewContainer: {
    paddingHorizontal: SPACING.space_15,
  },
  CategoryScrollViewItem: {
    alignItems: 'center',
  },
  CategoryText: {
    fontFamily: FONTFAMILY.poppins_semibold,
    fontSize: FONTSIZE.size_16,
    color: COLORS.primaryLightGreyHex,
    marginBottom: SPACING.space_4,
  },
  ActiveCategory: {
    height: SPACING.space_10,
    width: SPACING.space_10,
    borderRadius: BORDERRADIUS.radius_10,
    backgroundColor: COLORS.primaryOrangeHex,
  },
  FlatListContainer: {
    gap: SPACING.space_20,
    paddingVertical: SPACING.space_20,
    paddingHorizontal: SPACING.space_30,
  },
  EmptyListContainer: {
    width: Dimensions.get('window').width - SPACING.space_30 * 2,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SPACING.space_36 * 3.6,
  },
  CoffeeBeansTitle: {
    fontSize: FONTSIZE.size_18,
    marginLeft: SPACING.space_30,
    marginTop: SPACING.space_20,
    fontFamily: FONTFAMILY.poppins_medium,
    color: COLORS.secondaryLightGreyHex,
  },
})

export default HomeScreen