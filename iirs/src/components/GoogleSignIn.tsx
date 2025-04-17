import React, { useEffect, useState } from "react";

interface GoogleSignInProps {
  onSuccess: (userInfo: { id: string; name: string; email: string }) => void;
  onError: (error: string) => void;
  loginType: "student" | "admin";
}

const GoogleSignIn: React.FC<GoogleSignInProps> = ({
  onSuccess,
  onError,
  loginType,
}) => {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeGoogleSignIn = () => {
      // Load the Google Identity Services library
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      script.onload = () => {
        console.log("Google Identity Services script loaded");
        // @ts-ignore
        if (typeof google !== "undefined" && google.accounts) {
          // @ts-ignore
          google.accounts.id.initialize({
            client_id:
              "732915249891-jse07lo2r5e565p86s7lcippusk8tg9q.apps.googleusercontent.com",
            callback: async (response: any) => {
              console.log("Google Sign-In callback received");
              try {
                // Decode the JWT token to get user info
                const base64Url = response.credential.split(".")[1];
                const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
                const jsonPayload = decodeURIComponent(
                  atob(base64)
                    .split("")
                    .map(function (c) {
                      return (
                        "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2)
                      );
                    })
                    .join("")
                );

                const userInfo = JSON.parse(jsonPayload);
                console.log("User info received:", userInfo);
                onSuccess({
                  id: userInfo.sub,
                  name: userInfo.name,
                  email: userInfo.email,
                });
              } catch (error) {
                console.error("Error processing user info:", error);
                onError("Failed to process Google Sign-In. Please try again.");
              }
            },
          });

          // Render the Google Sign-In button
          const button = document.getElementById("googleSignInBtn");
          if (button) {
            // @ts-ignore
            google.accounts.id.renderButton(button, {
              theme: "outline",
              size: "large",
              text: "signin_with",
              shape: "rectangular",
              logo_alignment: "left",
            });
          }
        } else {
          console.error("Google Identity Services not available");
          onError(
            "Google Sign-In service not available. Please try again later."
          );
        }
      };

      script.onerror = (error) => {
        console.error("Error loading Google Identity Services:", error);
        onError(
          "Failed to load Google Sign-In service. Please try again later."
        );
      };
    };

    initializeGoogleSignIn();

    // Cleanup function
    return () => {
      const script = document.querySelector(
        'script[src="https://accounts.google.com/gsi/client"]'
      );
      if (script) {
        script.remove();
      }
    };
  }, [onSuccess, onError]);

  return (
    <div className="mt-4 text-center">
      <div
        id="googleSignInBtn"
        className={`w-full ${
          isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
        }`}
      />
    </div>
  );
};

export default GoogleSignIn;
