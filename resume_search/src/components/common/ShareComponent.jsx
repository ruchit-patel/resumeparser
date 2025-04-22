"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Check, Copy, Share } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { config } from "@/config";


const ShareComponent = ({ 
  title = "Share", 
  itemId,
  itemType = "candidate",
  open, 
  onOpenChange,
}) => {
  const [copied, setCopied] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [isSharing, setIsSharing] = useState(false);
  const [users, setUsers] = useState([]);
  
  // Generate shareable URL
  const shareableUrl = `${window.location.origin}${window.location.pathname}?${itemType}=${itemId}`;
  
  // Handle copy to clipboard
  const handleCopyClick = () => {
    navigator.clipboard.writeText(shareableUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Fetch users from API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${config.backendUrl}/api/method/resumeparser.apis.custom_apis.all_users`, {
          method: 'GET',
          credentials: 'include', // This ensures cookies are sent with the request
          headers: {
            'Content-Type': 'application/json',
          }
        });
        
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        
        const data = await response.json();
        if (data.message && Array.isArray(data.message)) {
          setUsers(data.message);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
        // Fallback to empty array if API fails
        setUsers([]);
      }
    };
    
    fetchUsers();
  }, []);

  // Handle share submission
  const handleShare = async () => {
    if (!selectedUser) {
      return;
    }

    setIsSharing(true);
    
    try {

        // Get CSRF token from window object
        const csrfToken = window.csrf_token;
        
        // Ensure all cookies are sent with the request
        const response = await fetch(`${config.backendUrl}/api/method/frappe.share.add`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Frappe-CSRF-Token': csrfToken,
          },
          credentials: 'include',
          body: JSON.stringify({
            "doctype": "Resume",
            "name": itemId,
            "user": selectedUser,
            "read": 1,
            "write": 1,
            "submit": 0,
            "share": 1,
            "notify": 1
        }),
        });
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        onOpenChange(false);
        return await response.json();
    } catch (error) {
    console.log(error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* URL display and copy button */}
          <div className="flex items-center border rounded-md p-2">
            <input
              className="flex-1 border-none outline-none bg-transparent text-sm"
              value={shareableUrl}
              readOnly
            />
            <button
              onClick={handleCopyClick}
              className="ml-2 p-1 rounded-md hover:bg-gray-100 focus:outline-none"
              title="Copy to clipboard"
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          </div>
          
          {/* User selection dropdown */}
          <div className="space-y-2">
            <label htmlFor="share-with" className="text-sm font-medium">
              Share with:
            </label>
            <Select value={selectedUser} onValueChange={setSelectedUser}>
              <SelectTrigger id="share-with" className="w-full">
                <SelectValue placeholder="Select a user" />
              </SelectTrigger>
              <SelectContent>
                {users.map(user => (
                  <SelectItem key={user.name} value={user.name}>
                    {user.email ? `${user.name} (${user.email})` : user.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          {/* Share button */}
          <Button 
            className="w-full" 
            onClick={handleShare} 
            disabled={isSharing || !selectedUser}
          >
            {isSharing ? "Sharing..." : "Share"}
            {!isSharing && <Share className="ml-2 h-4 w-4" />}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ShareComponent;
