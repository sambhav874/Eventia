'use client';
import React, { useEffect, useState } from "react";
import { useUser } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBuilding, faUser } from "@fortawesome/free-solid-svg-icons";

const Register = () => {
  const { user } = useUser(); 
  const [username, setUserName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [userType, setUserType] = useState<string>("");
  const [submissionStatus, setSubmissionStatus] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState<string>("");
  const [name , setName] = useState<string>('');

  useEffect(() => {
    if (user) {
      setUserName(user.username || "");
      setEmail(user.emailAddresses[0]?.emailAddress || "");
      setPhoneNumber(user.phoneNumbers[0]?.phoneNumber || "");
      setName(user.fullName || "");
    }
  }, [user]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!username || !email || !userType || !phoneNumber) {
      alert("Please fill out all the fields.");
      return;
    }
  
    setSubmissionStatus(true);
    
    console.log({ username, email, userType, phoneNumber }); 
  
    fetch('/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username,
        email,
        userType,
        phoneNumber,
        name
      }),
    })
    .then((response) => response.json())
    .then((data) => console.log(data))
    .catch((error) => console.error(error));
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-900 text-white">
      <div className="flex flex-col justify-center items-center space-y-6 rounded-md border-red-400 bg-primary-accent1 p-8 max-w-xl w-full">
        <h1 className="text-2xl font-bold">Register</h1>
        
        <form className="w-full space-y-2 flex justify-center items-center flex-col" onSubmit={handleSubmit}>
          <div className="flex flex-col space-y-2 justify-center items-center w-full">
            <Label htmlFor="username">Username</Label>
            <Input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUserName(e.target.value)} className="w-1/2"
            />

<Label htmlFor="name">Name</Label>
            <Input
              id="name"
              type="text" disabled
              value={name}
              onChange={(e) => setName(e.target.value)} className="w-1/2"
            />
          
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email} disabled
              onChange={(e) => setEmail(e.target.value)} className="w-1/2"
            />

            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input
              id="phoneNumber"
              type="text"
              value={phoneNumber} disabled
              onChange={(e) => setPhoneNumber(e.target.value)} className="w-1/2"
            />
          </div>
          
          <div className="flex flex-col space-y-2 items-center justify-center">
            <Label htmlFor="userType">User Type</Label>
            <div className="flex space-x-4 justify-center items-center">

              <Card 
                className={`mt-6 min-h-full cursor-pointer flex flex-col justify-center items-center ${userType === "user" ? 'border-2 border-green-400' : ''}`}
                onClick={() => setUserType("user")}
              >
                <CardHeader className="flex justify-center items-center">
                  <CardTitle><FontAwesomeIcon icon={faUser} className="h-12 w-12" /></CardTitle>
                  <CardDescription>User</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Find new events, get tickets to be on the board.</p>
                </CardContent>
                <CardFooter>
                  <p>Let's go!</p>
                </CardFooter>
              </Card>

              <Card 
                className={`mt-6 cursor-pointer min-h-full flex flex-col justify-center items-center ${userType === "organizer" ? 'border-2 border-green-400' : ''}`}
                onClick={() => setUserType("organizer")}
              >
                <CardHeader className="flex justify-center items-center">
                  <CardTitle><FontAwesomeIcon icon={faBuilding} className="h-12 w-12" /></CardTitle>
                  <CardDescription>Organiser</CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Be an organiser, engaging people into more and more events.</p>
                </CardContent>
                <CardFooter>
                  <p>Let's go!</p>
                </CardFooter>
              </Card>

            </div>
          </div>

          <Button type="submit" className="w-full">Register</Button>
        </form>
      </div>
    </div>
  );
};

export default Register;