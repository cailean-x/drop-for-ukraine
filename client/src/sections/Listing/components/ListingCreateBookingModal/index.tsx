import React from "react";
import { useMutation } from "@apollo/react-hooks";
import {
  CardElement,
  injectStripe,
  ReactStripeElements,
} from "react-stripe-elements";
import { Button, Divider, Icon, Modal, Typography } from "antd";
import moment, { Moment } from "moment";
import { CREATE_BOOKING } from "../../../../lib/graphql/mutations";
import {
  CreateBooking as CreateBookingData,
  CreateBookingVariables,
} from "../../../../lib/graphql/mutations/CreateBooking/__generated__/CreateBooking";
import {
  formatListingPrice,
  displaySuccessNotification,
  displayErrorMessage,
} from "../../../../lib/utils";

interface Props {
  id: string;
  price: number;
  modalVisible: boolean;
  checkInDate: Moment;
  setModalVisible: (modalVisible: boolean) => void;
  clearBookingData: () => void;
  handleListingRefetch: () => Promise<void>;
}

const { Paragraph, Text, Title } = Typography;

export const ListingCreateBookingModal = ({
  id,
  price,
  modalVisible,
  checkInDate,
  setModalVisible,
  clearBookingData,
  handleListingRefetch,
}: Props) => {
  const [createBooking, { loading }] = useMutation<
    CreateBookingData,
    CreateBookingVariables
  >(CREATE_BOOKING, {
    onCompleted: () => {
      clearBookingData();
      displaySuccessNotification(
        "You've successfully booked the listing!",
        "Booking history can always be found in your User page."
      );
      handleListingRefetch();
    },
    onError: () => {
      displayErrorMessage(
        "Sorry! We weren't able to successfully book the listing. Please try again later!"
      );
    },
  });

  // const daysBooked = checkOutDate.diff(checkInDate, "days") + 1;
  const listingPrice = price;

  const handleCreateBooking = async () => {
    // if (!stripe) {
    //   return displayErrorMessage(
    //     "Sorry! We weren't able to connect with Stripe."
    //   );
    // }

    // let { token: stripeToken, error } = await stripe.createToken();
    // if (stripeToken) {
    createBooking({
      variables: {
        input: {
          id,
          checkIn: moment(checkInDate).format("YYYY-MM-DD"),
        },
      },
    });
  };

  return (
    <Modal
      visible={modalVisible}
      centered
      footer={null}
      onCancel={() => setModalVisible(false)}
    >
      <div className="listing-booking-modal">
        <div className="listing-booking-modal__intro">
          <Title className="listing-boooking-modal__intro-title">
            <Icon type="car"></Icon>
          </Title>
          <Title level={3} className="listing-boooking-modal__intro-title">
            See you soon!
          </Title>
          <Paragraph>
            We will be wating for you on{" "}
            <Text mark strong>
              {moment(checkInDate).format("MMMM Do YYYY")}
            </Text>
            .
            {/* <Text mark strong>
              {moment(checkOutDate).format("MMMM Do YYYY")}
            </Text> */}
          </Paragraph>
        </div>

        {/* <Divider />

        <div className="listing-booking-modal__charge-summary">
          <Paragraph>
            {formatListingPrice(price, false)} * {daysBooked} days ={" "}
            <Text strong>{formatListingPrice(listingPrice, false)}</Text>
          </Paragraph>
          <Paragraph className="listing-booking-modal__charge-summary-total">
            Total = <Text mark>{formatListingPrice(listingPrice, false)}</Text>
          </Paragraph>
        </div>

        <Divider /> */}

        <div className="listing-booking-modal__stripe-card-section">
          {/* <CardElement
            hidePostalCode
            className="listing-booking-modal__stripe-card"
          /> */}
          <Button
            size="large"
            type="primary"
            className="listing-booking-modal__cta"
            loading={loading}
            onClick={handleCreateBooking}
          >
            Right!
          </Button>
        </div>
      </div>
    </Modal>
  );
};

// export const WrappedListingCreateBookingModal = injectStripe(
//   ListingCreateBookingModal
// );
