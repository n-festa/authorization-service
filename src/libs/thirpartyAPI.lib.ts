import * as FormData from 'form-data';
import axios from 'axios';

const sendOTPSMS = async (phoneNumber, otpCode) => {
  const sms = otpCode;
  let data = new FormData();
  data.append('u', '2alltest');
  data.append('pwd', '3ef20dcd-62a2-404a-aa6d-69551fcb4fdf');
  data.append('from', 'Vlocal');
  data.append('phone', phoneNumber);
  data.append('sms', sms); // funtion random 6 so
  data.append('bid', '123');
  data.append('pid', '');
  data.append('type', '0');
  data.append('json', '1');

  let config = {
    method: 'post',
    maxBodyLength: Infinity,
    url: 'https://cloudsms4.vietguys.biz:4438/api/index.php',
    headers: {
      ...data.getHeaders(),
    },
    data: data,
  };
  console.log('config', config);
  try {
    const response = await axios.request(config);
    return response.data;
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
};

export { sendOTPSMS };
