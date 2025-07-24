import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import axios from "axios";
import { API_URL } from "@/lib/api.env";
import { ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/authContext";
import toast from "react-hot-toast";

const HelpDesk = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState("start");
  const [orders, setOrders] = useState([]);
  const [enquiries, setEnquiries] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [issueType, setIssueType] = useState(null);
  const [enquiryType, setEnquiryType] = useState<
    "marketplace" | "property" | null
  >(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (step === "order-list") {
      const fetchOrders = async () => {
        setLoading(true);
        try {
          const res = await axios.get(`${API_URL}/api/users/get-orders`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setOrders(res.data.user[0].orders || []);
        } catch (err) {
          console.error("Error fetching orders", {
            error: err.message,
            status: err.response?.status,
            data: err.response?.data,
          });
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }

    if (step === "enquiry-type") {
      const fetchEnquiries = async () => {
        setLoading(true);
        try {
          const res = await axios.get(`${API_URL}/api/enquiry/user-enquiry`, {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          });
          setEnquiries(res.data || []);
        } catch (err) {
          console.error("Error fetching enquiries", {
            error: err.message,
            status: err.response?.status,
            data: err.response?.data,
          });
        } finally {
          setLoading(false);
        }
      };
      fetchEnquiries();
    }
  }, [step]);

  const reset = () => {
    setStep("start");
    setSelectedItem(null);
    setIssueType(null);
    setEnquiryType(null);
  };

  const renderChatStep = () => {
    if (loading) {
      return (
        <ChatBubble>
          <div className="flex items-center space-x-2">
            <span className="animate-spin h-5 w-5 border-2 border-t-transparent border-gray-500 rounded-full" />
            <span className="text-sm sm:text-base">Loading...</span>
          </div>
        </ChatBubble>
      );
    }
    switch (step) {
      case "start":
        return (
          <ChatBubble>
            <h2 className="text-sm font-medium">How can we help you?</h2>
            <div className="flex flex-col gap-2 mt-2">
              <Button onClick={() => setStep("order-list")} variant="outline">
                Order Related
              </Button>
              <Button onClick={() => setStep("enquiry-type")} variant="outline">
                Enquiry Related
              </Button>
              <Button onClick={() => setStep("other")}>Other</Button>
            </div>
          </ChatBubble>
        );

      case "order-list":
        return orders.length === 0 ? (
          <ChatBubble>
            No orders found.
            <Button
              variant="link"
              onClick={reset}
              className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </Button>
          </ChatBubble>
        ) : (
          <ChatBubble>
            <h2 className="text-sm font-medium mb-2">Your Orders</h2>
            <div className="space-y-3 text-sm  overflow-auto ">
              {orders.map((order, i) => (
                <Card
                  key={i}
                  onClick={() => {
                    setSelectedItem(order);
                    setStep("order-issue-type");
                  }}
                  className="cursor-pointer hover:bg-gray-100 transition "
                >
                  <CardContent className="text-sm space-y-2">
                    <div>
                      <strong>Date:</strong> {order.createdAt.split("T")[0]}
                    </div>
                    <div>
                      <strong>Order ID:</strong> {order.id}
                    </div>
                    <div>
                      <strong>Product Name:</strong> {order.product.name}
                    </div>
                    <div>
                      <strong>Amount:</strong> {order.totalAmount}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button
              variant="link"
              onClick={reset}
              className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </Button>
          </ChatBubble>
        );

      case "order-issue-type":
        return (
          <ChatBubble>
            <h2 className="text-sm font-medium mb-2">
              What is the issue related to?
            </h2>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => {
                  setIssueType("delivery");
                  setStep("chat-input");
                }}
                variant="outline"
              >
                Delivery
              </Button>
              <Button
                onClick={() => {
                  setIssueType("payment");
                  setStep("chat-input");
                }}
                variant="outline"
              >
                Payment
              </Button>
              <Button
                onClick={() => {
                  setIssueType("referral");
                  setStep("chat-input");
                }}
                variant="outline"
              >
                Referral
              </Button>
              <Button
                variant="link"
                onClick={reset}
                className=" flex items-center gap-1 text-blue-600 hover:text-blue-800"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </Button>
            </div>
          </ChatBubble>
        );

      case "enquiry-type":
        return (
          <ChatBubble>
            <h2 className="text-sm font-medium mb-2">Select enquiry type:</h2>
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => {
                  setEnquiryType("marketplace");
                  setStep("enquiry-list");
                }}
                variant="outline"
              >
                Marketplace
              </Button>
              <Button
                onClick={() => {
                  setEnquiryType("property");
                  setStep("enquiry-list");
                }}
                variant="outline"
              >
                Property
              </Button>
              <Button
                variant="link"
                onClick={reset}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-800"
              >
                <ChevronLeft className="w-5 h-5" />
                Back
              </Button>
            </div>
          </ChatBubble>
        );

      case "enquiry-list":
        const filtered = enquiries.filter((e) => e.linkedTo === enquiryType);
        return filtered.length === 0 ? (
          <ChatBubble>
            No {enquiryType} enquiries found.
            <Button
              variant="link"
              onClick={() => setStep("enquiry-type")}
              className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </Button>
          </ChatBubble>
        ) : (
          <ChatBubble>
            <h2 className="text-sm font-medium mb-2">Your Enquiries</h2>
            <div className="space-y-3">
              {filtered.map((enq, i) => (
                <Card
                  key={i}
                  onClick={() => {
                    setSelectedItem(enq);
                    setStep("chat-input");
                  }}
                  className="cursor-pointer hover:bg-gray-100 transition "
                >
                  <CardContent className="text-sm space-y-2">
                    <div>
                      <strong>Date:</strong> {enq.createdAt.split("T")[0]}
                    </div>
                    <div>
                      <strong>Item:</strong> {enq.itemName}{" "}
                      {enq.linkedTo
                        ? `(${
                            enq.linkedTo.charAt(0).toUpperCase() +
                            enq.linkedTo.slice(1)
                          })`
                        : ""}
                    </div>
                    <div>
                      <strong>Subject:</strong> {enq.subject}
                    </div>
                    <div className="truncate overflow-hidden whitespace-nowrap">
                      <strong>Message:</strong> {enq.message}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            <Button
              variant="link"
              onClick={() => setStep("enquiry-type")}
              className="mt-2 flex items-center gap-1 text-blue-600 hover:text-blue-800"
            >
              <ChevronLeft className="w-5 h-5" />
              Back
            </Button>
          </ChatBubble>
        );

      case "other":
        return (
          <ChatBubble>
            <h2 className="text-sm font-medium mb-2">
              Please enter your issue below:
            </h2>
            <ChatInput onSubmit={reset} type="other" step="other" />
          </ChatBubble>
        );

      case "chat-input":
        return (
          <ChatBubble>
            <p className="text-sm mb-2">
              Message regarding:{" "}
              <strong>
                {selectedItem?.product?.name || selectedItem?.itemName}
              </strong>
            </p>
            <ChatInput
              onSubmit={reset}
              selectedItem={selectedItem}
              issueType={issueType}
              step="chat-input"
            />
          </ChatBubble>
        );
    }
  };

  return (
    <div className="container p-4 mx-auto h-[100dvh] flex flex-col ">
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white ">
        <ChevronLeft
          className="w-6 h-6 cursor-pointer text-black"
          onClick={() => navigate("/profile")}
        />
        <h2 className="text-xl font-semibold text-black">Help Desk</h2>
        <div className="w-6 h-6" />
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-white">
        {renderChatStep()}
      </div>
    </div>
  );
};

const ChatBubble = ({ children }) => (
  <div className="bg-gray-100 text-gray-900 rounded-xl px-4 py-3 w-full mb-20 text-lg">
    {children}
  </div>
);

const ChatInput = ({
  onSubmit,
  selectedItem = null,
  issueType = null,
  step,
}) => {
  const [msg, setMsg] = useState("");
  const { user } = useAuth();

  console.log("selectedItem", selectedItem);

  const handleSubmit = async () => {
    try {
      if (!msg.trim()) {
        alert("Message is required.");
        return;
      }

      let sellerId = null;
      if (selectedItem?.product?.sellerId) {
        sellerId = selectedItem.product.sellerId;
      } else if (
        selectedItem?.linkedTo === "property" &&
        selectedItem?.sellerId
      ) {
        sellerId = selectedItem.sellerId;
      } else if (
        selectedItem?.linkedTo === "marketplace" &&
        selectedItem?.sellerId
      ) {
        sellerId = selectedItem.sellerId;
      } else if (step === "other") {
        sellerId = undefined;
      } else {
        console.error("Please select an item with a valid seller.");
        return;
      }

      const res = await axios.post(
        `${API_URL}/api/support/create`,
        {
          userId: user.id,
          sellerId,
          subject:
            step === "other"
              ? "Other"
              : step === "chat-input" && selectedItem?.product
              ? "Order"
              : "Enquiry",
          subSubject:
            step === "other"
              ? null
              : step === "chat-input" && selectedItem?.product
              ? issueType
              : selectedItem?.linkedTo === "marketplace"
              ? "marketplace"
              : "property",
          relatedId: selectedItem?.id || null,
          message: msg,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      console.log("res: ", res);

      toast.success("Support message sent");
      setMsg("");
      onSubmit();
    } catch (err) {
      console.error("Error sending support message", {
        error: err.message,
        status: err.response?.status,
        data: err.response?.data,
      });
      alert("Failed to send support message. Please try again.");
    }
  };

  return (
    <div className="mt-4 flex flex-col gap-2">
      <textarea
        value={msg}
        onChange={(e) => setMsg(e.target.value)}
        rows={4}
        placeholder="Type your message..."
        className="border rounded-md p-2"
      />
      <Button onClick={handleSubmit} disabled={!msg.trim()}>
        Send
      </Button>
    </div>
  );
};

export default HelpDesk;
