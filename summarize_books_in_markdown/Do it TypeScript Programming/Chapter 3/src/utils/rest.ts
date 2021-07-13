let address: any = {
  country: 'Korea',
  city: 'Seoul',
  address1: 'Gangnam-gu',
  address2: 'Sinsa-dong',
  address3: '123-456',
};

export const { country, city, ...detail} = address;
