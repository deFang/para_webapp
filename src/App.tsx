import React from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import ThemeProvider from './theme'
import MainProvider from './views/MainProvider'
import LayoutView from "./layout";




const App: React.FC = () => {
    return (
        <ThemeProvider>
          <MainProvider>
            <LayoutView/>
          </MainProvider>
        </ThemeProvider>
    );
};
//
// const Providers: React.FC = ({ children }) => {
//   return (
//     <ThemeProvider theme={theme}>
//       <UseWalletProvider chainId={config.chainId}>
//         <Provider store={store}>
//           <Updaters />
//           <ChainlinkProvider>
//                 <>
//                   <Popups />
//                   {children}
//                 </>
//           </ChainlinkProvider>
//         </Provider>
//       </UseWalletProvider>
//     </ThemeProvider>
//   );
// };

export default App;
