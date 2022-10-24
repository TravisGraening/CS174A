// based on the example on https://www.npmjs.com/package/@abandonware/noble

const noble = require('@abandonware/noble');

const uuid_service = "1101"
const uuid_value_x = "2101"
const uuid_value_y = "2102"
const uuid_value_z = "2103"

noble.on('stateChange', async (state) => {
  if (state === 'poweredOn') {
    console.log("start scanning")
    await noble.startScanningAsync([uuid_service], false);
  }
});

noble.on('discover', async (peripheral) => {
  await noble.stopScanningAsync();
  await peripheral.connectAsync();
  const {characteristics} = await peripheral.discoverSomeServicesAndCharacteristicsAsync([uuid_service], [uuid_value_x, uuid_value_y, uuid_value_z]);
  readData(characteristics[0])
  readData(characteristics[1])
  readData(characteristics[2])
  
});

//
// read data periodically
//
let readData = async (characteristic) => {
  const value = (await characteristic.readAsync());
  console.log(value.readFloatLE(0));

  // read data again in t milliseconds
  setTimeout(() => {
    readData(characteristic)
  }, 10);
}