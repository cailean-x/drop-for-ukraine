import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import selection, { selectionId } from "sections/Home/components/MapBox/layers/selection";
import drops from "sections/Home/components/MapBox/layers/drops";
import { isLayerExist } from "lib/utils/map";

interface Props {
  results: Map.MapListing[] | null;
  map: mapboxgl.Map | null;
}

const MapResults: React.FC<Props> = ({ results, map }) => {
  const history = useHistory();

  const onHover = (id: number | string) => {
    if (map) {
      if (isLayerExist(map, selectionId)) {
        map.removeLayer(selectionId);
        map.removeSource(selectionId);
      }
      const features = map.queryRenderedFeatures({ layers: [drops.id] } as any);
      const feature = features.filter(f => f.id === id)[0] as any;
      if (feature) {
        map.addLayer(selection(feature));
      }
    }
  }

  const onLeave = () => {
    if (map) {
      if (isLayerExist(map, selectionId)) {
        map.removeLayer(selectionId);
        map.removeSource(selectionId);
      }
    }
  }

  const onClick = (objectId: string | null) => {
    if(objectId) {
      history.push(`/listing/${objectId}`);
    }
  }

  return (
    <ScrollView options={{ scrollbars: { autoHide: "scroll" } }}>
      <ResultsWrapper>
        {results && results.length > 0 ? (
          results.map(result => (
            <ResultItem
              key={result.id}
              onMouseEnter={() => onHover(result.id)}
              onMouseLeave={onLeave}
              onClick={() => onClick(result.object_id)}
            >
              <ResultImg><img src={result.image} alt="" /></ResultImg>
              <ResultBody>
                <ResultTitle>{result.title}</ResultTitle>
                <ResultBodyItem>
                  <ResultIcon><FontAwesomeIcon icon={faTableCellsLarge} /></ResultIcon>
                  <div>{result.capacity} <span>m<sup>2</sup></span></div>
                </ResultBodyItem>
                <ResultBodyItem>
                  <ResultIcon><FontAwesomeIcon icon={faLocationDot} /></ResultIcon>
                  <div>
                    {[result.city, result.country, result.address.split(",")[0]].join(", ")}
                  </div>
                </ResultBodyItem>
              </ResultBody>
            </ResultItem>
          )
        )) : (
          <div>No results</div>
        )}
      </ResultsWrapper>
    </ScrollView>
  );
}

const ScrollView = styled(OverlayScrollbarsComponent)`
  height: 100%;
  max-height: 100%;
`;

const ResultsWrapper = styled.div`
  padding: 15px;
`;

const ResultItem = styled.div`
  border-radius: 8px;
  border: 1px solid #e5e5e5;
  display: flex;
  overflow: hidden;
  cursor: default;

  &:hover {
    background-color: #f9f9f9;
    box-shadow: 3px 3px 14px 5px #e2e2e2;
  }

  &:not(:last-child) {
    margin-bottom: 10px;
  }

`;

const ResultBody = styled.div`
  padding: 5px 10px;
`;

const ResultBodyItem = styled.div`
  display: flex;
  margin-bottom: 5px;
  line-height: 21px;
`;

const ResultImg = styled.div`
  height: auto;
  width: 20%;
  background: rgb(196 196 196);
  flex-shrink: 0;

  & img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

const ResultTitle = styled(ResultBodyItem)`
  color: #02020B;
`;

const ResultIcon = styled.div`
  height: 21px;
  display: flex;
  align-items: center;
  width: 25px;
  flex-shrink: 0;
`;

export default React.memo(MapResults);
