"use client";

import { useUser } from "@clerk/nextjs";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { organizerTypes } from "@/components/ui/logos/logos";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import ProfileImageUploader from "@/components/ProfileImageUploader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import UserTabs from "@/components/UserTabs";
import OrganizerTabs from "@/components/OrganizerTabs";

const ProfilePage = () => {
  const { user } = useUser();
  const [name, setName] = useState<string>("");
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [username, setUsername] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [mongoUser, setMongoUser] = useState<any>(null);
  const [userType, setUserType] = useState<string>("user");
  const [dob, setDob] = useState<Date | undefined>(new Date());
  const [gender, setGender] = useState<string>("");
  const [customGender, setCustomGender] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [website, setWebsite] = useState<string>("");
  const [linkedin, setLinkedIn] = useState<string>("");
  const [instagram, setInstagram] = useState<string>("");
  const [organizerType, setOrganizerType] = useState<string>("");
  const [customOrganizerType, setCustomOrganizerType] = useState<string>("");
  const [profilePictureUrl, setProfilePictureUrl] = useState<string>("");
  const [userRef, setUserRef] = useState<string>("");
  const [organizerRef, setOrganizerRef] = useState<string>("");
  const [bio, setBio] = useState<string>("");
  const [founder, setFounder] = useState<string>("");

  useEffect(() => {
    if (user) {
      setProfilePictureUrl(user.imageUrl);
      setName(user.fullName || "");
      setPhoneNumber(user.phoneNumbers[0]?.phoneNumber || "");
      setUsername(user.username || "");
      setEmail(user.emailAddresses[0]?.emailAddress || "");
      fetchUserDetails(user.emailAddresses[0]?.emailAddress);
    }
  }, [user]);

  async function fetchUserDetails(email: string) {
    if (email) {
      try {
        const response = await axios.post(`/api/profile`, { email });
        const { user, userInfo, organizerInfo } = response.data;
        setMongoUser(user);
        setUserType(user.userType);
        if (userInfo) {
          setProfilePictureUrl(userInfo.profilePicture || "");
          setWebsite(userInfo.website || "");
          setLinkedIn(userInfo.linkedin || "");
          setInstagram(userInfo.instagram || "");
          setGender(userInfo.gender || "");
          setAddress(userInfo.address || "");
          setDob(userInfo.dob ? new Date(userInfo.dob) : undefined);
          setUserRef(userInfo.userRef || "");
        } else if (organizerInfo) {
          setProfilePictureUrl(organizerInfo.profileLogo || "");
          setWebsite(organizerInfo.website || "");
          setLinkedIn(organizerInfo.linkedin || "");
          setInstagram(organizerInfo.instagram || "");
          setOrganizerType(organizerInfo.organizerType || "");
          setOrganizerRef(organizerInfo.organizerRef || "");
          setBio(organizerInfo.bio || "");
          setFounder(organizerInfo.founder || "");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
      }
    }
  }

  async function handleUpdateProfile() {
    let updates = {
      name,
      phoneNumber,
      website,
      linkedin,
      instagram,
    };

    if (userType === "organizer") {
      updates = {
        ...updates,
        organizerType: organizerType === "other" ? customOrganizerType : organizerType,
        profileLogo: profilePictureUrl,
        organizerRef,
        bio,
        founder,
      };
    } else if (userType === "user") {
      updates = {
        ...updates,
        dob,
        gender: gender === "other" ? customGender : gender,
        address,
        profilePicture: profilePictureUrl,
        userRef,
      };
    }

    try {
      const response = await axios.put("/api/profile", {
        email,
        updates,
        userType,
      });
      alert(response.data.message);
      setMongoUser(response.data.data);
    } catch (error) {
      console.error("Error updating profile:", error);
      alert("Failed to update profile");
    }
  }

  return (
    <div data-scroll-container className="container mx-auto mt-20 p-4">
      {user && (
        <Card className="w-full max-w-2xl mx-auto">
          <CardHeader>
            <CardTitle className="">
              {userType === "user" ? <UserTabs /> : <OrganizerTabs />}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex justify-center">
              <ProfileImageUploader
                onChange={(url) => setProfilePictureUrl(url)}
                value={profilePictureUrl}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" value={username} readOnly />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} readOnly />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="userType">User Type</Label>
              <Select value={userType} onValueChange={(value) => setUserType(value)}>
                <SelectTrigger id="userType">
                  <SelectValue placeholder="Select User Type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="user">User</SelectItem>
                  <SelectItem value="organizer">Organizer</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <Input id="website" value={website} onChange={(e) => setWebsite(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn</Label>
                <Input id="linkedin" value={linkedin} onChange={(e) => setLinkedIn(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="instagram">Instagram</Label>
                <Input id="instagram" value={instagram} onChange={(e) => setInstagram(e.target.value)} />
              </div>
            </div>

            {userType === "organizer" && (
              <div className="space-y-2">
                <Label htmlFor="organizerType">Organizer Type</Label>
                <Select value={organizerType} onValueChange={(value) => setOrganizerType(value)}>
                  <SelectTrigger id="organizerType">
                    <SelectValue placeholder="Select Organizer Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {organizerTypes.map((type, index) => (
                      <SelectItem key={index} value={type.name}>
                        <FontAwesomeIcon icon={type.symbol} className="mr-2" />
                        {type.name}
                      </SelectItem>
                    ))}
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
                {organizerType === "other" && (
                  <Input
                    value={customOrganizerType}
                    onChange={(e) => setCustomOrganizerType(e.target.value)}
                    placeholder="Specify Organizer Type"
                    className="mt-2"
                  />
                )}
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" value={bio} onChange={(e) => setBio(e.target.value)} />
                <Label htmlFor="founder">Founder</Label>
                <Input id="founder" value={founder} onChange={(e) => setFounder(e.target.value)} />
              </div>
            )}

            {userType === "user" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="gender">Gender</Label>
                  <Select value={gender} onValueChange={(value) => setGender(value)}>
                    <SelectTrigger id="gender">
                      <SelectValue placeholder="Select Gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {gender === "other" && (
                    <Input
                      value={customGender}
                      onChange={(e) => setCustomGender(e.target.value)}
                      placeholder="Specify Gender"
                      className="mt-2"
                    />
                  )}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Calendar
                    mode="single"
                    selected={dob}
                    onSelect={(date: Date | undefined) => setDob(date)}
                    className="rounded-md border"
                  />
                </div>
              </>
            )}

            <Button onClick={handleUpdateProfile} className="w-full">
              Update Profile
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ProfilePage;