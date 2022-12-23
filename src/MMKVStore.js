import CalendarModule from './CalendarModule';

export const storeDataMMKV = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    await CalendarModule.setStringMMKV(key, jsonValue);
  } catch (e) {
    // saving error
  }
};

export const getDataMMKV = async key => {
  try {
    const jsonValue = await CalendarModule.getMMKV(key);
    return jsonValue !== '' ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log('error in reading', e);
    // error reading value
  }
};

export const removeDataMMKV = async key => {
  try {
    await CalendarModule.removeMMKV(key);
  } catch (e) {
    // remove error
  }
};
