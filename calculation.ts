// import { write } from 'bun';
import { writeFileSync } from 'fs';

interface Segment { name: string, weightUsed?: number, weightLimit?: number, lengthUsed?: number, lengthLimit?: number, segments?: Segment[], stacks?: Pallet[][] }
interface Pallet { itemMasterId: number, width: number, height: number, length: number, weight: number, stackLimit: number, partFamily: string };

const truck: Segment = {
  name: "24T", // irrelevant width: 2500, height: 3000, length: 13600,
  weightLimit: 24000,
  segments: [{
    name: "24T.1", weightLimit: 11000,
    segments: [{
      name: "24T.1.1", weightLimit: 5500,
      segments: [
        { name: "24T.1.1.L", lengthLimit: 3400 },
        { name: "24T.1.1.R", lengthLimit: 3400 }],
    }, {
      name: "24T.1.2", weightLimit: 6500,
      segments: [
        { name: "24T.1.2.L", lengthLimit: 3400 },
        { name: "24T.1.2.R", lengthLimit: 3400 }]
    }]
  }, {
    name: "24T.2", weightLimit: 13500,
    segments: [{
      name: "24T.2.1", weightLimit: 7500,
      segments: [
        { name: "24T.2.1.L", lengthLimit: 3400 },
        { name: "24T.2.1.R", lengthLimit: 3400 }],
    }, {
      name: "24T.2.2", weightLimit: 6500,
      segments: [
        { name: "24T.2.2.L", lengthLimit: 3400 },
        { name: "24T.2.2.R", lengthLimit: 3400 }]
    }]
  }]
};

// const types = [
//   { itemMasterId: 1887, width: 1040, height: 820, length: 1225, weight: 310, quantity: 24, stackLimit: 2, partFamily: "FXD" },
//   { itemMasterId: 1888, width: 1040, height: 820, length: 1225, weight: 315, quantity: 24, stackLimit: 2, partFamily: "FXD" },
//   { itemMasterId: 2309, width: 1230, height: 820, length: 1225, weight: 560, quantity: 48, stackLimit: 2, partFamily: "FXDN" },
//   { itemMasterId: 2310, width: 1230, height: 820, length: 1225, weight: 560, quantity: 48, stackLimit: 2, partFamily: "FXDN" },
//   { itemMasterId: 2462, width: 1230, height: 820, length: 1225, weight: 560, quantity: 48, stackLimit: 2, partFamily: "FXDN" },
//   { itemMasterId: 25687, width: 1000, height: 1000, length: 1200, weight: 455, quantity: 2880, stackLimit: 2, partFamily: "MDA" },
//   { itemMasterId: 25692, width: 1000, height: 1000, length: 1200, weight: 346, quantity: 2340, stackLimit: 2, partFamily: "MDA" },
//   { itemMasterId: 25696, width: 740, height: 1000, length: 1200, weight: 460, quantity: 1200, stackLimit: 3, partFamily: "VFS" },
//   { itemMasterId: 25700, width: 1000, height: 1000, length: 1200, weight: 455, quantity: 2880, stackLimit: 2, partFamily: "MDA" },
//   { itemMasterId: 25701, width: 1000, height: 1000, length: 1200, weight: 455, quantity: 2880, stackLimit: 2, partFamily: "MDA" },
//   { itemMasterId: 25740, width: 1390, height: 1000, length: 1200, weight: 355, quantity: 24, stackLimit: 2, partFamily: "DL" },
//   { itemMasterId: 25771, width: 1080, height: 820, length: 1225, weight: 820, quantity: 72, stackLimit: 2, partFamily: "DQ" },
//   { itemMasterId: 26911, width: 740, height: 1000, length: 1200, weight: 460, quantity: 200, stackLimit: 3, partFamily: "VFS" },
//   { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 340, quantity: 200, stackLimit: 3, partFamily: "ACM" },
//   { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 355, quantity: 200, stackLimit: 3, partFamily: "ACM" },
//   { itemMasterId: 27729, width: 1230, height: 820, length: 1225, weight: 560, quantity: 48, stackLimit: 2, partFamily: "FXDN" },
//   { itemMasterId: 27730, width: 1230, height: 820, length: 1225, weight: 560, quantity: 48, stackLimit: 2, partFamily: "FXDN" }
// ];

const mappings = [
  { mappginId: 1, partFamilyA: "MDA", partFamilyB: "MDA" },
  { mappginId: 2, partFamilyA: "FXD", partFamilyB: "FXD" },
  { mappginId: 6, partFamilyA: "DL", partFamilyB: "DL" },
  { mappginId: 7, partFamilyA: "ACM", partFamilyB: "ACM" },
  { mappginId: 8, partFamilyA: "VFS", partFamilyB: "VFS" },
  { mappginId: 9, partFamilyA: "VFS", partFamilyB: "ACM" },
  { mappginId: 10, partFamilyA: "VFS", partFamilyB: "DL" },
  { mappginId: 11, partFamilyA: "ACM", partFamilyB: "DL" },
  { mappginId: 12, partFamilyA: "DL", partFamilyB: "ACM" },
  { mappginId: 13, partFamilyA: "DL", partFamilyB: "VFS" },
  { mappginId: 14, partFamilyA: "ACM", partFamilyB: "VFS" },
  { mappginId: 15, partFamilyA: "FXDN", partFamilyB: "FXDN" },
  { mappginId: 16, partFamilyA: "FXDN", partFamilyB: "FXD" },
  { mappginId: 17, partFamilyA: "FXD", partFamilyB: "FXDN" },
  { mappginId: 18, partFamilyA: "DQ", partFamilyB: "DQ" },
  { mappginId: 19, partFamilyA: "FXD", partFamilyB: "FXD" },
  { mappginId: 20, partFamilyA: "MDA", partFamilyB: "MDA" }
].reduce((mappings, { partFamilyA, partFamilyB }) => ({ ...mappings, [partFamilyA]: [...mappings[partFamilyA] || [], partFamilyB] }), {} as { [key: string]: string[] });

// const generatePallets = (pallets: Pallet[] = []) => {
//   if (!truck.weightLimit) return;
//   if (pallets.length >= 80) return pallets;
//   const palletsWeight = pallets.reduce((weight, pallet) => weight + pallet.weight, 0);
//   if (palletsWeight > truck.weightLimit) return pallets;
//   const { itemMasterId, width: length, height, length: width, weight: weightFull, stackLimit: stackLimitFull, partFamily } = types[Math.floor(Math.random() * types.length)];
//   const weight = Math.min(weightFull, truck.weightLimit - palletsWeight, Math.floor(20 + Math.random() * 10 * weightFull));
//   const stackLimit = weight === weightFull ? stackLimitFull : 0;
//   return generatePallets([...pallets, { itemMasterId, width, height, length, weight, stackLimit, partFamily }]);
// };
// const pallets = generatePallets();
const palletsMonday: Pallet[] = [
  { itemMasterId: 25687, width: 1000, height: 1000, length: 1200, weight: 423, stackLimit: 2, partFamily: "MDA"},
  { itemMasterId: 25687, width: 1000, height: 1000, length: 1200, weight: 423, stackLimit: 2, partFamily: "MDA"},
  { itemMasterId: 26911, width: 1000, height: 1000, length: 1200, weight: 469, stackLimit: 3, partFamily: "VFS"},
  { itemMasterId: 26911, width: 1000, height: 1000, length: 1200, weight: 469, stackLimit: 3, partFamily: "VFS"},
  { itemMasterId: 26911, width: 1000, height: 1000, length: 1200, weight: 469, stackLimit: 3, partFamily: "VFS"},
  { itemMasterId: 26911, width: 1000, height: 1000, length: 1200, weight: 469, stackLimit: 3, partFamily: "VFS"},
  { itemMasterId: 26911, width: 1000, height: 1000, length: 1200, weight: 469, stackLimit: 3, partFamily: "VFS"},
  { itemMasterId: 26911, width: 1000, height: 1000, length: 1200, weight: 469, stackLimit: 3, partFamily: "VFS"},
  { itemMasterId: 26911, width: 1000, height: 1000, length: 1200, weight: 469, stackLimit: 3, partFamily: "VFS"},
  { itemMasterId: 26911, width: 1000, height: 1000, length: 1200, weight: 469, stackLimit: 3, partFamily: "VFS"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 25740, width: 1000, height: 1000, length: 1200, weight: 388, stackLimit: 2, partFamily: "DL"},
  { itemMasterId: 25740, width: 1000, height: 1000, length: 1200, weight: 388, stackLimit: 2, partFamily: "DL"},
  { itemMasterId: 25740, width: 1000, height: 1000, length: 1200, weight: 388, stackLimit: 2, partFamily: "DL"},
  { itemMasterId: 25740, width: 1000, height: 1000, length: 1200, weight: 388, stackLimit: 2, partFamily: "DL"},
  { itemMasterId: 25740, width: 1000, height: 1000, length: 1200, weight: 388, stackLimit: 2, partFamily: "DL"},
  { itemMasterId: 25740, width: 1000, height: 1000, length: 1200, weight: 388, stackLimit: 2, partFamily: "DL"},
  { itemMasterId: 25740, width: 1000, height: 1000, length: 1200, weight: 388, stackLimit: 2, partFamily: "DL"},
  { itemMasterId: 25740, width: 1000, height: 1000, length: 1200, weight: 388, stackLimit: 2, partFamily: "DL"},
  { itemMasterId: 25771, width: 1000, height: 1000, length: 1200, weight: 494, stackLimit: 2, partFamily: "DQ"},
  { itemMasterId: 25771, width: 1000, height: 1000, length: 1200, weight: 494, stackLimit: 2, partFamily: "DQ"},
  { itemMasterId: 1887, width: 1300, height: 620, length: 1225, weight: 309, stackLimit: 2, partFamily: "FXD"},
  { itemMasterId: 1887, width: 1300, height: 620, length: 1225, weight: 309, stackLimit: 2, partFamily: "FXD"},
  { itemMasterId: 1887, width: 1300, height: 620, length: 1225, weight: 309, stackLimit: 2, partFamily: "FXD"},
  { itemMasterId: 1887, width: 1300, height: 620, length: 1225, weight: 309, stackLimit: 2, partFamily: "FXD"},
  { itemMasterId: 1887, width: 1300, height: 620, length: 1225, weight: 309, stackLimit: 2, partFamily: "FXD"},
  { itemMasterId: 1887, width: 1300, height: 620, length: 1225, weight: 309, stackLimit: 2, partFamily: "FXD"},
  { itemMasterId: 1887, width: 1300, height: 620, length: 1225, weight: 309, stackLimit: 2, partFamily: "FXD"},
  { itemMasterId: 1887, width: 1300, height: 620, length: 1225, weight: 309, stackLimit: 2, partFamily: "FXD"},
  { itemMasterId: 1887, width: 1300, height: 620, length: 1225, weight: 309, stackLimit: 2, partFamily: "FXD"},
  { itemMasterId: 1887, width: 1300, height: 620, length: 1225, weight: 309, stackLimit: 2, partFamily: "FXD"},
  { itemMasterId: 2462, width: 1300, height: 820, length: 1225, weight: 560, stackLimit: 2, partFamily: "FXDN"},
  { itemMasterId: 2462, width: 1300, height: 820, length: 1225, weight: 560, stackLimit: 2, partFamily: "FXDN"},
  { itemMasterId: 2462, width: 1300, height: 820, length: 1225, weight: 560, stackLimit: 2, partFamily: "FXDN"},
  { itemMasterId: 2462, width: 1300, height: 820, length: 1225, weight: 560, stackLimit: 2, partFamily: "FXDN"}
];
const palletsTuesday: Pallet[] = [
  { itemMasterId: 26911, width: 1000, height: 1000, length: 1200, weight: 469, stackLimit: 3, partFamily: "VFS"},
  { itemMasterId: 26911, width: 1000, height: 1000, length: 1200, weight: 469, stackLimit: 3, partFamily: "VFS"},
  { itemMasterId: 26911, width: 1000, height: 1000, length: 1200, weight: 469, stackLimit: 3, partFamily: "VFS"},
  { itemMasterId: 26911, width: 1000, height: 1000, length: 1200, weight: 469, stackLimit: 3, partFamily: "VFS"},
  { itemMasterId: 26911, width: 1000, height: 1000, length: 1200, weight: 469, stackLimit: 3, partFamily: "VFS"},
  { itemMasterId: 26911, width: 1000, height: 1000, length: 1200, weight: 469, stackLimit: 3, partFamily: "VFS"},
  { itemMasterId: 25700, width: 1000, height: 1000, length: 1200, weight: 442, stackLimit: 2, partFamily: "MDA"},
  { itemMasterId: 25700, width: 1000, height: 1000, length: 1200, weight: 442, stackLimit: 2, partFamily: "MDA"},
  { itemMasterId: 25700, width: 1000, height: 1000, length: 1200, weight: 443, stackLimit: 2, partFamily: "MDA"},
  { itemMasterId: 25700, width: 1000, height: 1000, length: 1200, weight: 442, stackLimit: 2, partFamily: "MDA"},
  { itemMasterId: 25700, width: 1000, height: 1000, length: 1200, weight: 442, stackLimit: 2, partFamily: "MDA"},
  { itemMasterId: 25700, width: 1000, height: 1000, length: 1200, weight: 442, stackLimit: 2, partFamily: "MDA"},
  { itemMasterId: 25700, width: 1000, height: 1000, length: 1200, weight: 442, stackLimit: 2, partFamily: "MDA"},
  { itemMasterId: 25700, width: 1000, height: 1000, length: 1200, weight: 443, stackLimit: 2, partFamily: "MDA"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 25740, width: 1000, height: 1000, length: 1200, weight: 388, stackLimit: 2, partFamily: "DL"},
  { itemMasterId: 25740, width: 1000, height: 1000, length: 1200, weight: 388, stackLimit: 2, partFamily: "DL"},
  { itemMasterId: 25740, width: 1000, height: 1000, length: 1200, weight: 388, stackLimit: 2, partFamily: "DL"},
  { itemMasterId: 25740, width: 1000, height: 1000, length: 1200, weight: 388, stackLimit: 2, partFamily: "DL"},
  { itemMasterId: 25740, width: 1000, height: 1000, length: 1200, weight: 388, stackLimit: 2, partFamily: "DL"},
  { itemMasterId: 25740, width: 1000, height: 1000, length: 1200, weight: 388, stackLimit: 2, partFamily: "DL"},
  { itemMasterId: 25740, width: 1000, height: 1000, length: 1200, weight: 388, stackLimit: 2, partFamily: "DL"},
  { itemMasterId: 25740, width: 1000, height: 1000, length: 1200, weight: 388, stackLimit: 2, partFamily: "DL"},
  { itemMasterId: 2462, width: 1300, height: 820, length: 1225, weight: 560, stackLimit: 2, partFamily: "FXDN"},
  { itemMasterId: 2462, width: 1300, height: 820, length: 1225, weight: 560, stackLimit: 2, partFamily: "FXDN"},
  { itemMasterId: 2462, width: 1300, height: 820, length: 1225, weight: 560, stackLimit: 2, partFamily: "FXDN"},
  { itemMasterId: 2462, width: 1300, height: 820, length: 1225, weight: 560, stackLimit: 2, partFamily: "FXDN"}
];
const palletsWednesday: Pallet[] = [
  { itemMasterId: 26911, width: 1000, height: 1000, length: 1200, weight: 469, stackLimit: 3, partFamily: "VFS"},
  { itemMasterId: 26911, width: 1000, height: 1000, length: 1200, weight: 469, stackLimit: 3, partFamily: "VFS"},
  { itemMasterId: 26911, width: 1000, height: 1000, length: 1200, weight: 469, stackLimit: 3, partFamily: "VFS"},
  { itemMasterId: 26911, width: 1000, height: 1000, length: 1200, weight: 469, stackLimit: 3, partFamily: "VFS"},
  { itemMasterId: 26911, width: 1000, height: 1000, length: 1200, weight: 469, stackLimit: 3, partFamily: "VFS"},
  { itemMasterId: 26911, width: 1000, height: 1000, length: 1200, weight: 469, stackLimit: 3, partFamily: "VFS"},
  { itemMasterId: 26911, width: 1000, height: 1000, length: 1200, weight: 469, stackLimit: 3, partFamily: "VFS"},
  { itemMasterId: 26911, width: 1000, height: 1000, length: 1200, weight: 469, stackLimit: 3, partFamily: "VFS"},
  { itemMasterId: 26911, width: 1000, height: 1000, length: 1200, weight: 469, stackLimit: 3, partFamily: "VFS"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26917, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 26921, width: 1000, height: 1000, length: 1200, weight: 347, stackLimit: 3, partFamily: "ACM"},
  { itemMasterId: 25740, width: 1000, height: 1000, length: 1200, weight: 388, stackLimit: 2, partFamily: "DL"},
  { itemMasterId: 25740, width: 1000, height: 1000, length: 1200, weight: 388, stackLimit: 2, partFamily: "DL"},
  { itemMasterId: 25740, width: 1000, height: 1000, length: 1200, weight: 388, stackLimit: 2, partFamily: "DL"},
  { itemMasterId: 25740, width: 1000, height: 1000, length: 1200, weight: 388, stackLimit: 2, partFamily: "DL"},
  { itemMasterId: 25740, width: 1000, height: 1000, length: 1200, weight: 388, stackLimit: 2, partFamily: "DL"},
  { itemMasterId: 25740, width: 1000, height: 1000, length: 1200, weight: 388, stackLimit: 2, partFamily: "DL"},
  { itemMasterId: 2462, width: 1300, height: 820, length: 1225, weight: 560, stackLimit: 2, partFamily: "FXDN"},
  { itemMasterId: 2462, width: 1300, height: 820, length: 1225, weight: 560, stackLimit: 2, partFamily: "FXDN"},
  { itemMasterId: 2462, width: 1300, height: 820, length: 1225, weight: 560, stackLimit: 2, partFamily: "FXDN"},
  { itemMasterId: 2462, width: 1300, height: 820, length: 1225, weight: 560, stackLimit: 2, partFamily: "FXDN"},
  { itemMasterId: 2462, width: 1300, height: 820, length: 1225, weight: 560, stackLimit: 2, partFamily: "FXDN"},
  { itemMasterId: 2462, width: 1300, height: 820, length: 1225, weight: 560, stackLimit: 2, partFamily: "FXDN"},
  { itemMasterId: 2462, width: 1300, height: 820, length: 1225, weight: 560, stackLimit: 2, partFamily: "FXDN"},
  { itemMasterId: 2462, width: 1300, height: 820, length: 1225, weight: 560, stackLimit: 2, partFamily: "FXDN"}
];

interface Box { name?: string, color?: number, w: number, h: number, l: number, x: number, y: number, z: number };
const extact = (segment: Segment, sections: Pallet[][][] = []) => {
  if (segment.segments) segment.segments.map(segment => extact(segment, sections));
  if (segment.stacks) sections.push(segment.stacks);
  return sections;
};
const output = (truck: Segment, pallets: Pallet[]) => {
  const colors = [0x005f73, 0x0a9396, 0x94d2bd, 0xe9d8a6, 0xee9b00, 0xca6702, 0xca6702, 0xbb3e03, 0xae2012];
  const sections: Pallet[][][] = extact(truck);
  const boxes: Box[] = [{ w: 2300, h: 2300, l: 1100, x: 100, y: 100, z: -1200 }]; // NOTE: truck cabin
  sections.map((stacks, index) => {
    const section = { w: 1250, h: 4000, l: 3400, x: index % 2 * 1250, y: 0, z: (index / 2 | 0) * 3400 };
    boxes.push({ ...section }); // NOTE: don't be lazy, stop using so many mutations
    section.x += 25;
    stacks.map(stack => {
      stack.map(pallet => {
        const name = `${pallet.partFamily} ${pallet.width / 1000}x${pallet.height / 1000}x${pallet.length / 1000}M ${pallet.weight}KG`;
        const color = colors.at(Object.keys(mappings).indexOf(pallet.partFamily));
        boxes.push({ w: pallet.width, h: pallet.height, l: pallet.length, x: section.x, y: section.y, z: section.z, name, color });
        section.y += pallet.height;
      })
      section.z += stack.at(0)?.length || 0;
      section.y = 0;
    });
  });
  const temp = { x: -1500, y: 0, z: 0 }; // NOTE: pallets that couldn't be loaded
  pallets.map(pallet => {
    const name = `${pallet.partFamily} ${pallet.width / 1000}x${pallet.height / 1000}x${pallet.length / 1000}M ${pallet.weight}KG`;
    const color = colors.at(Object.keys(mappings).indexOf(pallet.partFamily));
    boxes.push({ w: pallet.width, h: pallet.height, l: pallet.length, x: temp.x, y: temp.y, z: temp.z, name, color });
    temp.z += pallet.length + 100;
  });
  // await write('output.json', JSON.stringify(boxes));
  writeFileSync('output.json', JSON.stringify(boxes));
};

const best: { truck?: Segment, pallets?: Pallet[] } = {};
const packPallets = (truck: Segment, pallets: Pallet[], seq: number[] = []): Segment => {
  const packOnePallet = (segment: Segment, pallet: Pallet): Segment => {
    if (segment.weightLimit && segment.weightLimit - (segment.weightUsed || 0) < pallet.weight) return segment;
    if (segment.segments) {
      for (const innerSegment of segment.segments) {
        const changedSegment = packOnePallet(innerSegment, pallet);
        if (changedSegment === innerSegment) continue; // NOTE: failed to pack into inner segment
        return {
          ...segment,
          weightUsed: (segment.weightUsed || 0) + pallet.weight,
          segments: segment.segments.map(item => item === innerSegment ? changedSegment : item)
        };
      }
    }
    if (segment.stacks) {
      for (const stacks of segment.stacks) {
        if ((stacks.at(-1)?.length || 0) < pallet.length) continue;
        if ((stacks.at(0)?.stackLimit || 0) <= stacks.length) continue;
        if (!(mappings[String(stacks.at(-1)?.partFamily)] || []).includes(pallet.partFamily)) continue;
        return {
          ...segment,
          stacks: segment.stacks.map(item => item === stacks ? stacks.concat(pallet) : item)
        };
      }
    }
    if (!segment.lengthLimit) return segment;
    if (segment.lengthLimit && segment.lengthLimit - (segment.lengthUsed || 0) < pallet.length) return segment;
    return {
      ...segment,
      lengthUsed: (segment.lengthUsed || 0) + pallet.length,
      stacks: (segment.stacks || []).concat([[pallet]]) // NOTE: this array-within-an-array syntax makes no sense...
    };
  };

  if (!pallets.length) {
    console.log("HUGE-SUCCESS", truck, pallets);
    output(truck, pallets);
    return { ...truck };
  }

  for (const pallet of pallets) {
    const palletIndex = pallets.indexOf(pallet);
    const changedTruck = packOnePallet(truck, pallet);
    if (changedTruck === truck) {
      continue; // FAILED to pack that pallet
    }
    const finishedTruck = packPallets(changedTruck, pallets.filter(item => item !== pallet), [...seq, palletIndex]);
    if (finishedTruck === changedTruck) {
      if ((best.truck?.weightUsed || 0) < (truck.weightUsed || 0)) {
        best.truck = truck;
        best.pallets = pallets;
        console.log("DEAD-END", truck.weightUsed, truck.weightLimit, seq);
        output(truck, pallets);
        break;
      }
      continue; // FAILED to pack the rest
    }
    return finishedTruck;
  }
  return truck;
};

// [Workers](https://bun.sh/docs/api/workers) needed! 😱
packPallets(truck, palletsMonday.sort((a, b) => b.stackLimit - a.stackLimit).sort((a, b) => b.weight - a.weight));
