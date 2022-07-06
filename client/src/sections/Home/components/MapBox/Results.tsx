import React from "react";
import mapboxgl from "mapbox-gl";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import selection from "sections/Home/components/MapBox/layers/selection";
import { isLayerExist } from "utils/map";

interface Props {
  results: Map.MapListing[] | null;
  map: mapboxgl.Map | null;
}

const MapResults: React.FC<Props> = ({ results, map }) => {
  const history = useHistory();

  const onHover = (id: number | string) => {
    if (map) {
      if (isLayerExist(map, "drops-layer-selected")) {
        map.removeLayer("drops-layer-selected");
        map.removeSource("drops-layer-selected");
      }
      const features = map.queryRenderedFeatures({ layers: ["drops-layer"] } as any);
      const feature = features.filter(f => f.id === id)[0] as any;
      if (feature) {
        map.addLayer(selection(feature));
      }
    }
  }

  const onLeave = () => {
    if (map) {
      if (isLayerExist(map, "drops-layer-selected")) {
        map.removeLayer("drops-layer-selected");
        map.removeSource("drops-layer-selected");
      }
    }
  }

  const onClick = (objectId: string | null) => {
    if(objectId) {
      history.push(`/listing/${objectId}`);
    }
  }

  return (
    <OverlayScrollbarsComponent
      options={{ scrollbars: { autoHide: "scroll" } }}
      className="scrollview"
    >
      <div className="scrollview-body">
        {results && results.length > 0 ? (
          results.map(result => (
            <div
              key={result.id}
              className="result-item"
              onMouseEnter={() => onHover(result.id)}
              onMouseLeave={onLeave}
              onClick={() => onClick(result.object_id)}
            >
              <div className="result-img"><img src={result.image} alt="" /></div>
              <div className="result-body">
                <div className="result-body-item title">{result.title}</div>
                <div className="result-body-item">
                  <div className="icon"><FontAwesomeIcon icon={faTableCellsLarge} /></div>
                  <div>{result.capacity} <span>m<sup>2</sup></span></div>
                </div>
                <div className="result-body-item">
                  <div className="icon"><FontAwesomeIcon icon={faLocationDot} /></div>
                  <div>
                    {[result.city, result.country, result.address.split(",")[0]].join(", ")}
                  </div>
                </div>
              </div>
            </div>
          )
        )) : (
          <div>No results</div>
        )}
      </div>
    </OverlayScrollbarsComponent>
  );
}

export default React.memo(MapResults);
