import axios from 'axios';

export default axios.create({
    baseURL: `${location.origin}` // eslint-disable-line no-restricted-globals
});