import React from 'react';
import { BottomNavigation, BottomNavigationTab } from '@ui-kitten/components';


const BottomTabBar = ({ navigation, state }) => (
    <BottomNavigation
      selectedIndex={state.index}
      onSelect={index => navigation.navigate(state.routeNames[index])}>
      <BottomNavigationTab title='Médicos'/>
      <BottomNavigationTab title='Exámenes'/>
    </BottomNavigation>
);


export default BottomTabBar;