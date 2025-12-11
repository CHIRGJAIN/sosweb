export default {
  states: ['State X','State Y'],
  districts: { 'State X': ['District A','District B'], 'State Y': ['District C'] },
  services: [
    { id: 'svc-1', name: 'Ambulance', desc: 'Emergency ambulance service', state: 'State X', district: 'District A' },
    { id: 'svc-2', name: 'Relief Camp', desc: 'Temporary relief camp', state: 'State X', district: 'District B' }
  ]
};
