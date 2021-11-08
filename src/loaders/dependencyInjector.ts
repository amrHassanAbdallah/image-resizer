import { Container } from 'typedi';
import LoggerInstance from './logger';

export default () => {
    try {


        Container.set('logger', LoggerInstance);

        LoggerInstance.info('✌️ all good');

        return  ;
    } catch (e) {
        LoggerInstance.error('🔥 Error on dependency injector loader: %o', e);
        throw e;
    }
};
