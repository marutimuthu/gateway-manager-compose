import React from 'react';
import GoogleMapReact from 'google-map-react';
import { google_map_api_key } from 'src/api/app.js';
import { Box } from '@mui/system';
const curThemeName = localStorage.getItem('appTheme') || 'PureLightTheme';

const AnyReactComponent = ({ text }) => <div>{text}</div>;

export default function SimpleMap() {
  let defaultProps
  {
    curThemeName == 'PureLightTheme' ? (
      defaultProps = {
        // 19.168906375045335, 72.85321442599377
        // 13.024437,80.177188
        center: {
          lat: 13.024437,
          lng: 80.177188
        },
        zoom: 13
      }
      ) : (
        defaultProps = {
          // 19.168906375045335, 72.85321442599377
          // 13.024437,80.177188
          center: {
            lat: 13.024437,
            lng: 80.177188
          },
          zoom: 13,
          styles: [
            { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
            { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
            {
              featureType: 'administrative.locality',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#d59563' }]
            },
            {
              featureType: 'poi',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#d59563' }]
            },
            {
              featureType: 'poi.park',
              elementType: 'geometry',
              stylers: [{ color: '#263c3f' }]
            },
            {
              featureType: 'poi.park',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#6b9a76' }]
            },
            {
              featureType: 'road',
              elementType: 'geometry',
              stylers: [{ color: '#38414e' }]
            },
            {
              featureType: 'road',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#212a37' }]
            },
            {
              featureType: 'road',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#9ca5b3' }]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry',
              stylers: [{ color: '#746855' }]
            },
            {
              featureType: 'road.highway',
              elementType: 'geometry.stroke',
              stylers: [{ color: '#1f2835' }]
            },
            {
              featureType: 'road.highway',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#f3d19c' }]
            },
            {
              featureType: 'transit',
              elementType: 'geometry',
              stylers: [{ color: '#2f3948' }]
            },
            {
              featureType: 'transit.station',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#d59563' }]
            },
            {
              featureType: 'water',
              elementType: 'geometry',
              stylers: [{ color: '#17263c' }]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.fill',
              stylers: [{ color: '#515c6d' }]
            },
            {
              featureType: 'water',
              elementType: 'labels.text.stroke',
              stylers: [{ color: '#17263c' }]
            }
          ]
        }
    )
  }

  // Custom Marker Component
  const Marker = ({ text }) => (
    <div
      style={{
        color: 'white',
        background: 'darkgrey',
        padding: '10px 10px',
        borderRadius: '20%',
        display: 'inline-block',
        transform: 'translate(-50%, -50%)'
      }}
    >
      {text}
    </div>
  );

  return (
    // Important! Always set the container height explicitly
    <Box>
      {google_map_api_key !== '' ? (
        <div style={{ height: '40vh', width: '100%', cursor: 'none' }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: google_map_api_key }}
            defaultCenter={defaultProps.center}
            defaultZoom={defaultProps.zoom}
            options={{ styles: defaultProps.styles }}
            yesIWantToUseGoogleMapApiInternals
          >
            {/* Custom Marker */}
            <Marker
              lat={defaultProps.center.lat}
              lng={defaultProps.center.lng}
              text="Gateway"
            />
          </GoogleMapReact>
        </div>
      ) : (
        false
      )}
    </Box>
  );
}
