import React from "react";
import styled from "styled-components";
import { useHistory } from "react-router-dom";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import drops from "sections/Home/components/MapBox/layers/drops";
import CapacityIcon from "sections/Home/components/MapBox/icons/area.svg";
import MarkerIcon from "sections/Home/components/MapBox/icons/marker.svg";

interface Props {
  results: Map.MapListing[] | null;
  map: mapboxgl.Map | null;
}

const MapResults: React.FC<Props> = ({ results, map }) => {
  const history = useHistory();

  const onHover = (id: number | string) => {
    if (map) {
      map.setFeatureState({ source: drops.sourceId!, sourceLayer: "provider", id }, { hovered: true });
    }
  }

  const onLeave = () => {
    if (map) {
      map.removeFeatureState({ source: drops.sourceId!, sourceLayer: "provider" });
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
                  <ResultIcon><img src={CapacityIcon} alt="" /></ResultIcon>
                  <div>{result.capacity} <span>m<sup>2</sup></span></div>
                </ResultBodyItem>
                <ResultBodyItem>
                  <ResultIcon><img src={MarkerIcon} alt="" /></ResultIcon>
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
  padding: 20px;
`;

const ResultItem = styled.div`
  border-radius: 10px;
  border: 1px solid #F2F2F2;
  display: flex;
  overflow: hidden;
  cursor: pointer;

  &:hover {
    background-color: #f4f4f4;
    box-shadow: 0px 4px 4px rgba(50, 50, 71, 0.08), 0px 4px 8px rgba(50, 50, 71, 0.06);
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
  line-height: 20px;
  font-family: 'Rubik';
  font-weight: 400; 
  font-size: 12px;
  color: #757575;
`;

const ResultImg = styled.div`
  height: auto;
  width: 25%;
  background: #e2e2e2;
  flex-shrink: 0;

  & img {
    object-fit: cover;
    width: 100%;
    height: 100%;
  }
`;

const ResultTitle = styled(ResultBodyItem)`
  font-family: 'Rubik';
  font-weight: 500;
  font-size: 12px;
  color: #02020B;
`;

const ResultIcon = styled.div`
  height: 19px;
  width: 19px;
  display: flex;
  align-items: center;
  flex-shrink: 0;
`;

export default React.memo(MapResults);
