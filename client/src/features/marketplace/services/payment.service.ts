import API from '../../../../src/api/axios';

const getAuthHeaders = ()=>{
  const token = localStorage.getItem("accessToken") || localStorage.getItem("token") || localStorage.getItem("authToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface FeaturedPlan {
  name: string;
  description: string;
  amount: number;
  duration: number;
}

export interface Payment {
  id: number;
  amount: string;
  status: string;
  plan: string;
  duration: string;
  createdAt: string;
}
export interface PaymentVerification {
  status: string;
  amount: number;
  currency: string;
  customerEmail?: string;
  metadata: {
    propertyId: string;
    userId: string;
    plan: string;
    duration: string;
  };
}

export const paymentService = {
  getPlan: async (): Promise<Record<string, FeaturedPlan>>=>{
    const res = await API.get(`payments/plans`);
    return res.data.plans;
  },

  createCheckout: async (propertyId: number, plan: string): Promise<string> =>{
    const res = await API.post(`payments/checkout`,
      {propertyId, plan},
      { headers: getAuthHeaders() }
    )
    return res.data.url;
  },

  verifySession: async (sessionId: string): Promise<PaymentVerification>=>{
    const res = await API.post(`payments/verify-session/${sessionId}`,
      {headers: getAuthHeaders()}
    )
    return res.data.data
  },
  getMyPayments: async (): Promise<Payment[]>=>{
    const res = await API.get(`payments/my-payments`, { headers: getAuthHeaders() });
    return res.data.data;
  }
}
