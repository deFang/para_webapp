import {useContext} from 'react';
import {Context} from '../contexts/ParaProvider';

const usePara = () => {
  const { para } = useContext(Context);
  return para;
};

export default usePara;
