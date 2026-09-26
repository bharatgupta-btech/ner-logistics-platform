export const nerGeoJSON = {
  type: "FeatureCollection",
  features: [
    {
      type: "Feature",
      properties: { name: "Assam", id: "AS" },
      geometry: { type: "Polygon", coordinates: [[[90.0, 26.0], [92.0, 28.0], [95.0, 27.0], [93.0, 25.0], [90.0, 26.0]]] }
    },
    {
      type: "Feature",
      properties: { name: "Arunachal Pradesh", id: "AR" },
      geometry: { type: "Polygon", coordinates: [[[92.0, 28.0], [95.0, 29.0], [97.0, 28.0], [95.0, 27.0], [92.0, 28.0]]] }
    }
  ]
};

export const districtLocations = [
  { id: 'd1', name: 'Guwahati', state: 'Assam', lat: 26.1445, lng: 91.7362 },
  { id: 'd2', name: 'Shillong', state: 'Meghalaya', lat: 25.5788, lng: 91.8933 },
  { id: 'd3', name: 'Imphal', state: 'Manipur', lat: 24.8170, lng: 93.9368 },
  { id: 'd4', name: 'Dimapur', state: 'Nagaland', lat: 25.8640, lng: 93.7297 },
  { id: 'd5', name: 'Aizawl', state: 'Mizoram', lat: 23.7271, lng: 92.7176 },
  { id: 'd6', name: 'Itanagar', state: 'Arunachal Pradesh', lat: 27.0844, lng: 93.6053 },
  { id: 'd7', name: 'Agartala', state: 'Tripura', lat: 23.8315, lng: 91.2868 },
  { id: 'd8', name: 'Gangtok', state: 'Sikkim', lat: 27.3389, lng: 88.6065 }
];
