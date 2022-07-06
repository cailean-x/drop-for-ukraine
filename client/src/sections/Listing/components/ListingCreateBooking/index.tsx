import React, { useMemo } from "react";
import { Redirect } from "react-router-dom";
import { useMutation } from "@apollo/react-hooks";
import { Button, Card, DatePicker, Divider, Typography } from "antd";
import moment, { Moment } from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSpinner } from '@fortawesome/free-solid-svg-icons';
import { Listing as ListingData } from "lib/graphql/queries/Listing/__generated__/Listing";
import { Viewer } from "lib/types";
import MapboxMap from "sections/Home/components/MapBox";
import { DeleteListing, DeleteListingVariables } from "lib/graphql/mutations/DeleteListing/__generated__/DeleteListing";
import { DELETE_LISTING } from "lib/graphql/mutations";
import { displayErrorMessage, displaySuccessNotification } from "lib/utils";

const { Paragraph, Text, Title } = Typography;

interface Props {
  id: string;
  viewer: Viewer;
  host: ListingData["listing"]["host"];
  price: number;
  bookingsIndex: ListingData["listing"]["bookingsIndex"];
  checkInDate: Moment | null;
  setCheckInDate: (checkInDate: Moment | null) => void;
  setModalVisible: (modalVisible: boolean) => void;
  geometry: ListingData["listing"]["geometry"];
}

export const ListingCreateBooking = ({
  id,
  viewer,
  host,
  checkInDate,
  setCheckInDate,
  setModalVisible,
  geometry,
}: Props) => {
  const marker = useMemo(() => (geometry && geometry[0] ? { lng: geometry[0], lat: geometry[1] } : null), [geometry]);
  const [deleteListing, { loading, data }] = useMutation<DeleteListing, DeleteListingVariables>(DELETE_LISTING, {
    onError: () => displayErrorMessage("Some error occurred while deleting the listing!"),
    onCompleted: () => displaySuccessNotification("You've successfully deleted your listing!"),
  });

  // const dateIsBooked = (currentDate: Moment) => {
  //   const year = moment(currentDate).year();
  //   const month = moment(currentDate).month();
  //   const day = moment(currentDate).date();

  //   if (bookingsIndexJSON[year] && bookingsIndexJSON[year][month]) {
  //     return Boolean(bookingsIndexJSON[year][month][day]);
  //   } else {
  //     return false;
  //   }
  // };

  const disabledDate = (currentDate?: Moment) => {
    if (currentDate) {
      const dateIsBeforeEndOfDay = currentDate.isBefore(moment().endOf("day"));
      const dateIsMoreThanThreeMonthsAhead = moment(currentDate).isAfter(
        moment().endOf("day").add(90, "days")
      );

      return dateIsBeforeEndOfDay || dateIsMoreThanThreeMonthsAhead;
    } else {
      return false;
    }
  };

  // const verifyAndSetCheckOutDate = (selectedCheckOutDate: Moment | null) => {
  //   if (checkInDate && selectedCheckOutDate) {
  //     if (moment(selectedCheckOutDate).isBefore(checkInDate, "days")) {
  //       return displayErrorMessage(
  //         `You can't book date of check out to be prior to check in!`
  //       );
  //     }

  //     let dateCursor = checkInDate;

  //     while (moment(dateCursor).isBefore(selectedCheckOutDate, "days")) {
  //       dateCursor = moment(dateCursor).add(1, "days");

  //       const year = moment(dateCursor).year();
  //       const month = moment(dateCursor).month();
  //       const day = moment(dateCursor).date();

  //       if (
  //         bookingsIndexJSON[year] &&
  //         bookingsIndexJSON[year][month] &&
  //         bookingsIndexJSON[year][month][day]
  //       ) {
  //         return displayErrorMessage(
  //           "You can't book a period of time that overlaps existing bookings. Please try again!"
  //         );
  //       }
  //     }
  //   }
  // };

  const viewerIsHost = viewer.id === host.id;
  const checkInInputDisabled = !viewer.id || viewerIsHost;
  const buttonDisabled = !checkInDate;

  let buttonMessage = "We look forward to seeing you!";
  if (!viewer.id) {
    buttonMessage = "You have to be signed in to make it work!";
  } else if (viewerIsHost) {
    buttonMessage = "You can't book a date at your own place!";
    // } else if (!host.hasWallet) {
    //   buttonMessage =
    //     "The host has disconnected from Stripe and thus won't be able to receive payments!";
    // }
  }

  if (data && data.deleteListing) {
    return <Redirect to={`/user/${viewer.id}`} />;
  }

  return (
    <>
      {viewerIsHost && (
        <Button
          className="listing-delete-btn"
          size="large"
          block
          type="danger"
          disabled={loading}
          onClick={() => deleteListing({ variables: { input: { id } } })}
        >
          {loading ? <FontAwesomeIcon icon={faSpinner} spin /> : "Delete"}
        </Button>
      )}
      <div className="listing-booking">
        <Card className="listing-booking__card">
          <div>
            <Paragraph>
              <Title level={2} className="listing-booking__card-title">
                {/* {formatListingPrice(price)} */}
                <span role="img" aria-label="img">📅</span>
              </Title>
            </Paragraph>
            <Divider />
            <div className="listing-booking__card-date-picker">
              <Paragraph strong>When do you plan to come?</Paragraph>
              <DatePicker
                value={checkInDate ? checkInDate : undefined}
                format={"YYYY/MM/DD"}
                showToday={false}
                disabled={checkInInputDisabled}
                disabledDate={disabledDate as any}
                onChange={(dateValue) => setCheckInDate(dateValue)}
                renderExtraFooter={() => {
                  return (
                    <div>
                      <Text type="secondary" className="ant-calendar-footer-text">
                        You can only pick a date within 90 days from today.
                      </Text>
                    </div>
                  );
                }}
              />
            </div>
            {/* <div className="listing-booking__card-date-picker">
              <Paragraph strong>Check Out</Paragraph>
              <DatePicker
                value={checkOutDate ? checkOutDate : undefined}
                format={"YYYY/MM/DD"}
                showToday={false}
                disabled={checkOutInputDisabled}
                disabledDate={disabledDate}
                onChange={(dateValue) => verifyAndSetCheckOutDate(dateValue)}
                dateRender={(current) => {
                  if (
                    moment(current).isSame(
                      checkInDate ? checkInDate : undefined,
                      "day"
                    )
                  ) {
                    return (
                      <Tooltip title="Check in date">
                        <div className="ant-calendar-date ant-calendar-date__check-in">
                          {current.date()}
                        </div>
                      </Tooltip>
                    );
                  } else {
                    return (
                      <div className="ant-calendar-date">{current.date()}</div>
                    );
                  }
                }}
                renderExtraFooter={() => {
                  return (
                    <div>
                      <Text type="secondary" className="ant-calendar-footer-text">
                        Check-out cannot be before check-in.
                      </Text>
                    </div>
                  );
                }}
              />
            </div> */}
          </div>
          <Divider />
          <Button
            disabled={buttonDisabled}
            size="large"
            type="primary"
            className="listing-booking__card-cta"
            onClick={() => setModalVisible(true)}
          >
            Confirm
          </Button>
          <Text type="secondary" mark>
            {buttonMessage}
          </Text>
          <Divider />
          <MapboxMap type="item" markerPos={marker} />
        </Card>
      </div>
    </>
  );
};
