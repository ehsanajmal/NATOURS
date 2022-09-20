import axios from 'axios';
import { showAlert } from './alerts';
const stripe = Stripe('pk_test_51Lk0NrHhP5DWLGLp1UAR2sY28eZQ7KVSuXhY6DhL5cNK1nUgzKr5BBbcTJDBfdyA5pN39ZoGoeBnWveXmPoai1wR00g1o1om87')

export const bookTour = async tourId => {
  try {
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    // console.log(session);

    // 2) Create checkout form + chanre credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    });
  } catch (err) {
    console.log(err);
    showAlert('error', err);
  }
};
