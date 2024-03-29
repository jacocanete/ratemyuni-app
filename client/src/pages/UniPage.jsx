import { useParams, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Spinner, Avatar, Card, Rating, Button } from "flowbite-react";
import { set } from "mongoose";
import { FaStar } from "react-icons/fa";
import UniRating from "../components/UniRating";
import { useSelector } from "react-redux";
import { FaLongArrowAltLeft, FaBook, FaShieldAlt } from "react-icons/fa";
import { IoCreateOutline, IoPeopleCircle } from "react-icons/io5";
import { PiBuildingsFill } from "react-icons/pi";
import CreateReview from "../components/CreateReview.jsx";
import { Tooltip } from "flowbite-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function University() {
  const { currentUser } = useSelector((state) => state.user);
  const { uniSlug } = useParams();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [university, setUniversity] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reviews, setReviews] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/university/read?slug=${uniSlug}`);
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          return;
        }
        if (res.ok) {
          setUniversity(data.universities[0]);
          if (!data.universities[0]) {
            navigate("/");
            toast.error(`Page with slug "${uniSlug}" not found.`);
          }
        }
      } catch (error) {
        setError(true);
      }
    };

    fetchUniversity();
  }, [uniSlug]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await fetch(
          `/api/review/read?universityId=${university._id}`
        );
        const data = await res.json();
        if (!res.ok) {
          setError(true);
          return;
        }
        if (res.ok) {
          setReviews(data.reviews);
          setLoading(false);
          setError(false);
        }
      } catch (error) {
        setError(true);
      }
    };

    fetchReviews();
  }, [university]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Spinner color="pink" size="xl" />
      </div>
    );
  }

  function getStarColor(rating) {
    if (rating >= 4) {
      return "text-green-500";
    } else if (rating >= 3) {
      return "text-yellow-300";
    } else if (rating >= 2) {
      return "text-orange-500";
    } else if (rating >= 1) {
      return "text-red-500";
    } else {
      return "text-gray-400";
    }
  }

  function getBGColor(rating) {
    if (rating >= 4) {
      return "bg-green-500";
    } else if (rating >= 3) {
      return "bg-yellow-300";
    } else if (rating >= 2) {
      return "bg-orange-500";
    } else if (rating >= 1) {
      return "bg-red-500";
    } else {
      return "bg-gray-400";
    }
  }

  console.log(university);

  return (
    <>
      <main className="max-w-6xl mx-auto mt-5 mb-24 min-h-screen p-5 lg:p-0">
        <div className="flex mt-10">
          <Avatar
            img={university && university.logo}
            alt={university && university.title}
            size="xl"
            className="border rounded-full dark:border-gray-800"
            rounded
          />
        </div>
        <div className="mt-10 space-y-3">
          <h1 className="text-4xl font-bold tracking-tight text-gray-700 dark:text-white">
            {university && university.title}
          </h1>
          <p className="text-xl font-semibold text-gray-600 dark:text-gray-400 text-pretty">
            Located in {university && university.location} City
          </p>
          <p className="text-lg text-gray-600 dark:text-gray-400 text-pretty">
            {university && university.description}
          </p>
        </div>
        <div className="mt-10 w-full flex flex-row justify-between">
          <Link to="/">
            <Button color="pink">
              <FaLongArrowAltLeft className="h-4 w-4 mr-2" />
              Home
            </Button>
          </Link>

          {currentUser ? (
            <Button
              color="pink"
              disabled={!currentUser}
              onClick={() => {
                setShowModal(true);
              }}
            >
              <IoCreateOutline className="h-5 w-5 mr-2" />
              Write a Review
            </Button>
          ) : (
            <Tooltip content="Sign in to leave a review.">
              <Button
                color="pink"
                disabled={!currentUser}
                onClick={() => {
                  setShowModal(true);
                }}
              >
                <IoCreateOutline className="h-5 w-5 mr-2" />
                Write a Review
              </Button>
            </Tooltip>
          )}
        </div>
        <div className="w-full flex flex-col lg:flex-row mt-10 gap-y-10 divide-y-2 lg:divide-y-0">
          <div className="basis-1/3 gap-y-10 flex flex-col md:flex-row lg:flex-col">
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-5">Overall Rating</h2>
              <div className="flex items-center gap-3">
                <FaStar
                  className={`h-16 w-16 ${getStarColor(
                    university && university.overallRating
                  )}`}
                />
                <span className="text-6xl font-semibold">
                  {university && university.overallRating.toFixed(1)}
                </span>
              </div>
            </div>
            <div className="w-full">
              <h2 className="text-xl font-semibold mb-5">Rating Breakdown</h2>
              <div className="flex flex-col gap-2">
                <div className="flex flex-row items-center">
                  <div className="basis-1/2">
                    <span className="text-lg font-semibold">Education</span>
                  </div>
                  <div>
                    <UniRating
                      rating={university && university.educationRating}
                    />
                  </div>
                </div>
                <div className="flex flex-row items-center">
                  <div className="basis-1/2">
                    <span className="text-lg font-semibold">Facility</span>
                  </div>
                  <div>
                    <UniRating
                      rating={university && university.facilityRating}
                    />
                  </div>
                </div>
                <div className="flex flex-row items-center">
                  <div className="basis-1/2">
                    <span className="text-lg font-semibold">Social</span>
                  </div>
                  <div>
                    <UniRating rating={university && university.socialRating} />
                  </div>
                </div>
                <div className="flex flex-row items-center">
                  <div className="basis-1/2">
                    <span className="text-lg font-semibold">Admin</span>
                  </div>
                  <div>
                    <UniRating rating={university && university.adminRating} />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="basis-2/3 space-y-4">
            <div className="mt-6 lg:mt-0">
              {university && university.totalRatings > 0 ? (
                <h2 className="text-xl font-semibold">
                  Browse {university && university.totalRatings}{" "}
                  {university.totalRatings > 1 ? "reviews" : "review"}
                </h2>
              ) : (
                <h2 className="text-xl font-semibold">No Reviews Yet</h2>
              )}
              {currentUser ? (
                <p className="text-gray-600 dark:text-gray-400"></p>
              ) : (
                <p className="text-gray-600 dark:text-gray-400">
                  You must be signed in to leave a review.
                </p>
              )}
            </div>

            {reviews.map((review) => (
              <Card
                key={review._id}
                className="bg-white dark:bg-gray-800 shadow-md border-0 dark:shadow-none rounded-md transition duration-300 ease-in-out"
              >
                <div className="flex flex-col lg:flex-row lg:items-center items-start  justify-between gap-y-5">
                  <div className="flex flex-row items-center gap-3">
                    <div
                      className={`border w-14 h-14 rounded-full flex justify-center ${getBGColor(
                        review.overallRating
                      )} dark:border-gray-500`}
                    >
                      <span className="flex items-center text-white font-bold gap-0.5">
                        {review.overallRating.toFixed(1)}
                        <FaStar className="h-5 w-5" />
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-semibold dark:text-gray-400">
                        {review.formattedDate}
                      </span>
                    </div>
                  </div>
                  <div className="flex-wrap flex gap-x-2 gap-y-2 text-sm">
                    <div className="flex items-center gap-x-2">
                      <span className="border rounded-full flex flex-row items-center gap-2 px-2 dark:border-gray-500 dark:text-gray-400">
                        <FaBook className="h-3 w-3" />
                        <span className="text-sm">Education</span>
                        <span className="flex items-center gap-0.5 text-xs">
                          {review.education.toFixed(0)}
                          <FaStar className="h-3 w-3" />
                        </span>
                      </span>
                      <span className="border rounded-full flex flex-row items-center gap-2 px-2 dark:border-gray-500 dark:text-gray-400">
                        <PiBuildingsFill className="h-4 w-4" />
                        <span className="text-sm">Facility</span>
                        <span className="flex items-center gap-0.5 text-xs">
                          {review.facility.toFixed(0)}
                          <FaStar className="h-3 w-3" />
                        </span>
                      </span>
                    </div>
                    <div className="flex items-center gap-x-2">
                      <span className="border rounded-full flex flex-row items-center gap-2 px-2 dark:border-gray-500 dark:text-gray-400">
                        <IoPeopleCircle className="h-4 w-4" />
                        <span className="text-sm">Social</span>
                        <span className="flex items-center gap-0.5 text-xs">
                          {review.social.toFixed(0)}
                          <FaStar className="h-3 w-3" />
                        </span>
                      </span>
                      <span className="border rounded-full flex flex-row items-center gap-2 px-2 dark:border-gray-500 dark:text-gray-400">
                        <FaShieldAlt className="h-3 w-3" />
                        <span className="text-sm">Admin</span>
                        <span className="flex items-center gap-0.5 text-xs">
                          {review.admin.toFixed(0)}
                          <FaStar className="h-3 w-3" />
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-pretty dark:text-gray-300">
                  {review.content}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <CreateReview
        showModal={showModal}
        setShowModal={setShowModal}
        university={university && university._id}
      />
    </>
  );
}
