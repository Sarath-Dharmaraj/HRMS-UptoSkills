import React, { useState } from 'react';
import CountUp from 'react-countup';
import {
  FaHeart, FaRegHeart, FaCommentDots, FaShareAlt, FaBookmark, FaRegBookmark, FaEllipsisV, FaPlus
} from 'react-icons/fa';
import {
  FaBirthdayCake, FaCalendar, FaUser, FaGem
} from 'react-icons/fa';
import {
  startOfWeek, addDays, format, addWeeks,
  isBefore, isSameWeek, isSameDay, parseISO
} from 'date-fns';
import classNames from 'classnames';
import { BsDisplay } from 'react-icons/bs';

// --- MainContent ---
const shareOptions = [
  { name: 'Instagram', icon: '📸' },
  { name: 'Snapchat', icon: '👻' },
  { name: 'WhatsApp', icon: '💬' },
  { name: 'Facebook', icon: '📘' },
];
const emojiList = ['👍', '❤️', '😂', '🎉', '😮'];
const currentUser = { name: 'Current User', initials: 'CU' };

function MainContent() {
  const [comments, setComments] = useState({});
  const [replies, setReplies] = useState({});
  const [showComments, setShowComments] = useState({});
  const [showReplies, setShowReplies] = useState({});
  const [showShare, setShowShare] = useState(null);

  const [newPostContent, setNewPostContent] = useState('');
  const [newPostImage, setNewPostImage] = useState(null);
  const [newPostTags, setNewPostTags] = useState('');
  const [newPostAttachment, setNewPostAttachment] = useState(null);
  const [showNewPostModal, setShowNewPostModal] = useState(false);

  const [posts, setPosts] = useState([
    {
      id: 1,
      user: 'Alison Hata',
      initials: 'AH',
      content: 'Alison just completed 2 years in the company. Congratulate her!',
      image: null,
      likes: 24,
      comments: [],
      isLiked: false,
      isSaved: false
    },
    {
      id: 2,
      user: 'Harith Swanson',
      initials: 'HS',
      content: 'Thanks for leading one of the most productive design sprints ever, Rosia...',
      image: 'images/group-discussion.jpeg',
      points: 200,
      recipient: 'Rosia Thorpe',
      likes: 42,
      comments: [
        {
          id: 1,
          user: 'Clarence Gale',
          initials: 'CG',
          content: 'Had an amazing experience working on the sprint...',
          replies: []
        }
      ],
      isLiked: true,
      isSaved: false
    }
  ]);

  const handleLike = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isLiked: !post.isLiked, likes: post.isLiked ? post.likes - 1 : post.likes + 1 }
        : post
    ));
  };

  const handleSave = (postId) => {
    setPosts(posts.map(post =>
      post.id === postId
        ? { ...post, isSaved: !post.isSaved }
        : post
    ));
  };

  const handleCommentSubmit = (e, postId) => {
    e.preventDefault();
    const newComment = comments[postId]?.trim();
    if (!newComment) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const newCommentObj = {
          id: Date.now(),
          user: currentUser.name,
          initials: currentUser.initials,
          content: newComment,
          replies: []
        };
        return { ...post, comments: [...post.comments, newCommentObj] };
      }
      return post;
    });

    setPosts(updatedPosts);
    setComments(prev => ({ ...prev, [postId]: '' }));
  };

  const handleReplySubmit = (e, postId, commentId) => {
    e.preventDefault();
    const newReply = replies[`${postId}-${commentId}`]?.trim();
    if (!newReply) return;

    const updatedPosts = posts.map(post => {
      if (post.id === postId) {
        const updatedComments = post.comments.map(comment => {
          if (comment.id === commentId) {
            const newReplyObj = {
              id: Date.now(),
              user: currentUser.name,
              initials: currentUser.initials,
              content: newReply
            };
            return {
              ...comment,
              replies: [...comment.replies, newReplyObj]
            };
          }
          return comment;
        });
        return { ...post, comments: updatedComments };
      }
      return post;
    });

    setPosts(updatedPosts);
    setReplies(prev => ({ ...prev, [`${postId}-${commentId}`]: '' }));
    setShowReplies(prev => ({ ...prev, [`${postId}-${commentId}`]: false }));
  };

  const toggleComments = (postId) => {
    setShowComments(prev => ({ ...prev, [postId]: !prev[postId] }));
  };

  const toggleReplyInput = (postId, commentId) => {
    const key = `${postId}-${commentId}`;
    setShowReplies(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleShareClick = (postId) => {
    setShowShare(showShare === postId ? null : postId);
  };

  const handleNewPostSubmit = () => {
    if (!newPostContent.trim()) return;
    const newPost = {
      id: Date.now(),
      user: currentUser.name,
      initials: currentUser.initials,
      content: newPostContent,
      image: newPostImage ? URL.createObjectURL(newPostImage) : null,
      tags: newPostTags,
      attachment: newPostAttachment ? newPostAttachment.name : null,
      likes: 0,
      comments: [],
      isLiked: false,
      isSaved: false
    };
    setPosts([newPost, ...posts]);
    setNewPostContent('');
    setNewPostImage(null);
    setNewPostTags('');
    setNewPostAttachment(null);
    setShowNewPostModal(false);
  };

  const handleEdit = (postId) => {
    alert(`Edit post ${postId}`);
    setOptionsPostId(null);
  };

  const handleDelete = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
    setOptionsPostId(null);
  };

  const handleReport = (postId) => {
    alert(`Reported post ${postId}`);
    setOptionsPostId(null);
  };

  const [optionsPostId, setOptionsPostId] = useState(null);

  return (
    <div className="main-content mx-[3%] px-0 md:px-[3%] py-[3%] w-auto scrollbar-none">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg md:text-xl font-semibold">Feed</h4>
        <div>
          <button className="bg-green-600 text-white font-semibold py-1 px-3 rounded-md transition duration-300 hover:bg-green-700" onClick={() => setShowNewPostModal(true)}>
            <FaPlus className="inline-block mr-1" /> Post
          </button>
        </div>
      </div>

      {posts.map(post => (
        <div key={post.id} className="mb-3 rounded-xl shadow-lg bg-white border border-gray-200">
          <div className="p-4">
            <div className="flex justify-between items-start mb-2 flex-wrap">
              <div className="flex items-center flex-wrap">
                <div className="w-10 h-10 rounded-full bg-blue-500 text-white flex items-center justify-center font-bold mr-2">{post.initials}</div>
                <strong className="text-gray-900">{post.user}</strong>
                {post.points && (
                  <>
                    <span className="mx-2 text-gray-600">gave</span>
                    <span className="bg-yellow-400 text-black text-xs font-semibold px-2.5 py-1 rounded-full">{post.points} points</span>
                    <span className="mx-2 text-gray-600">to</span>
                    <strong className="text-gray-900">{post.recipient}</strong>
                  </>
                )}
              </div>
              <div className="relative">
                <button className="p-1 rounded-full bg-transparent transition duration-200 text-gray-600 hover:bg-gray-200" onClick={() => setOptionsPostId(optionsPostId === post.id ? null : post.id)}>
                  <FaEllipsisV/>
                </button>
                {optionsPostId === post.id && (
                  <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-10">
                    {post.user === currentUser.name ? (
                      <>
                        <button className="block w-full text-left bg-transparent px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => handleEdit(post.id)}>Edit</button>
                        <button className="block w-full text-left bg-transparent px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => handleDelete(post.id)}>Delete</button>
                      </>
                    ) : (
                      <button className="block w-full text-left bg-transparent px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => handleReport(post.id)}>Report</button>
                    )}
                  </div>
                )}
              </div>
            </div>

            <p className="text-gray-700 mb-2">{post.content}</p>
            {post.tags && <div className="mb-2"><small className="text-gray-500">Tags: {post.tags}</small></div>}
            {post.attachment && <div className="mb-2"><small className="text-gray-500">Attachment: {post.attachment}</small></div>}
            {post.image && (
              <div className="post-image mb-3">
                <img src={post.image} alt="Post" className="w-full h-auto rounded-lg" />
              </div>
            )}

            <div className="flex justify-between items-center border-t border-b border-gray-200 py-2">
              <div className="flex flex-wrap">
                <button className="p-0 mr-3 text-gray-600 bg-transparent hover:bg-transparent hover:text-red-500" onClick={() => handleLike(post.id)}>
                  {post.isLiked ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                  <span className="ml-1 text-gray-600">{post.likes}</span>
                </button>
                <button className="p-0 mr-3 text-gray-600 bg-transparent hover:bg-transparent hover:text-gray-800" onClick={() => toggleComments(post.id)}>
                  <FaCommentDots />
                  <span className="ml-1 text-gray-600">{post.comments.length}</span>
                </button>
                <button className="p-0 text-gray-600 bg-transparent hover:bg-transparent hover:text-gray-800" onClick={() => handleShareClick(post.id)}>
                  <FaShareAlt />
                </button>
              </div>
              <button
                className={classNames("p-0 text-gray-600 bg-transparent hover:bg-transparenthover:text-gray-800", {
                  "text-blue-600": post.isSaved,
                  "text-gray-600": !post.isSaved,
                })}
                onClick={() => handleSave(post.id)}
              >
                {post.isSaved ? <FaBookmark /> : <FaRegBookmark />}
              </button>
            </div>

            {showShare === post.id && (
              <div className="flex flex-wrap gap-2 p-3 mt-3 bg-gray-100 rounded-lg shadow-sm">
                {shareOptions.map(option => (
                  <button key={option.name} className="flex items-center justify-center bg-gray-200 text-gray-700 px-3 py-1 rounded-md text-sm transition-transform duration-200 hover:bg-gray-300">
                    <span className="mr-1">{option.icon}</span> Share on {option.name}
                  </button>
                ))}
              </div>
            )}

            {showComments[post.id] && (
              <div className="comments-section mt-3">
                <form onSubmit={(e) => handleCommentSubmit(e, post.id)} className="mb-3">
                  <div className="flex flex-col md:flex-row gap-2">
                    <textarea
                      rows={2}
                      placeholder="Write a comment"
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={comments[post.id] || ''}
                      onChange={(e) => setComments(prev => ({ ...prev, [post.id]: e.target.value }))}
                    />
                    <button
                      type="submit"
                      className="bg-blue-600 text-white px-4 py-2 rounded-md self-end disabled:bg-gray-400"
                      disabled={!comments[post.id]?.trim()}
                    >
                      Post
                    </button>
                  </div>
                </form>

                {post.comments.map(comment => (
                  <div key={comment.id} className="relative mb-3 pl-4 border-l-2 border-gray-300">
                    <div className="flex items-start">
                      <div className="w-8 h-8 rounded-full bg-gray-300 text-black flex items-center justify-center text-sm font-bold mr-2">{comment.initials}</div>
                      <div className="flex-1">
                        <strong className="text-gray-900">{comment.user}</strong>
                        <p className="text-gray-700 mb-1">{comment.content}</p>

                        <div className="flex gap-1 flex-wrap my-1">
                          {emojiList.map((emoji, index) => (
                            <button key={index} className="flex items-center justify-center w-8 h-8 text-lg rounded-full transition-transform duration-200 hover:scale-110 hover:bg-gray-200">{emoji}</button>
                          ))}
                        </div>

                        <button className="text-sm text-gray-500 hover:text-blue-600" onClick={() => toggleReplyInput(post.id, comment.id)}>
                          Reply
                        </button>

                        {showReplies[`${post.id}-${comment.id}`] && (
                          <form onSubmit={(e) => handleReplySubmit(e, post.id, comment.id)} className="mt-2">
                            <input
                              type="text"
                              placeholder="Write a reply"
                              className="w-full p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-2"
                              value={replies[`${post.id}-${comment.id}`] || ''}
                              onChange={(e) => setReplies(prev => ({ ...prev, [`${post.id}-${comment.id}`]: e.target.value }))}
                            />
                            <button type="submit" className="bg-gray-400 text-white px-3 py-1 rounded-md text-sm disabled:bg-gray-300" disabled={!replies[`${post.id}-${comment.id}`]?.trim()}>
                              Reply
                            </button>
                          </form>
                        )}

                        {comment.replies.length > 0 && comment.replies.map(reply => (
                          <div key={reply.id} className="mt-2 ml-4 pl-4 border-l-2 border-gray-300">
                            <div className="flex items-start">
                              <div className="w-8 h-8 rounded-full bg-gray-300 text-black flex items-center justify-center text-sm font-bold mr-2">{reply.initials}</div>
                              <div>
                                <strong className="text-gray-900">{reply.user}</strong>
                                <p className="text-gray-700 mb-0">{reply.content}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      ))}

      {showNewPostModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Create New Post</h3>
              <button className="text-gray-500 hover:text-gray-800" onClick={() => setShowNewPostModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <textarea
                  rows={4}
                  placeholder="What's on your mind?"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="block text-gray-700 font-semibold mb-1">Upload Image</label>
                <input type="file" accept="image/*" className="w-full text-gray-700" onChange={(e) => setNewPostImage(e.target.files[0])} />
              </div>
              <div className="mb-3">
                <label className="block text-gray-700 font-semibold mb-1">Tags (comma separated)</label>
                <input type="text" className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" value={newPostTags} onChange={(e) => setNewPostTags(e.target.value)} />
              </div>
              <div className="mb-3">
                <label className="block text-gray-700 font-semibold mb-1">Attachment</label>
                <input type="file" className="w-full text-gray-700" onChange={(e) => setNewPostAttachment(e.target.files[0])} />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400" onClick={() => setShowNewPostModal(false)}>Cancel</button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:bg-gray-400" onClick={handleNewPostSubmit} disabled={!newPostContent.trim()}>Post</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- RightPanel ---
function generateWeeks() {
  const startDate = new Date(2025, 0, 1);
  const endDate = new Date(2025, 11, 31);
  let weeks = [];
  let current = startOfWeek(startDate, { weekStartsOn: 1 });

  while (isBefore(current, endDate)) {
    const week = Array.from({ length: 7 }, (_, i) => addDays(current, i));
    weeks.push(week);
    current = addWeeks(current, 1);
  }
  return weeks;
}

function RightPanel() {
  const today = new Date();
  const [points, setPoints] = useState(1284);
  const rewardGoal = 2000;

  const [birthdays, setBirthdays] = useState([
    { name: 'John', date: '2025-02-04' },
    { name: 'Aisha', date: '2025-07-27' },
  ]);
  const [showModal, setShowModal] = useState(false);
  const [newBdayName, setNewBdayName] = useState('');
  const [newBdayDate, setNewBdayDate] = useState('');

  const allWeeks = generateWeeks();
  const initialWeekIndex = allWeeks.findIndex(week =>
    isSameWeek(week[0], today, { weekStartsOn: 1 })
  );
  const [currentWeekIndex, setCurrentWeekIndex] = useState(
    initialWeekIndex === -1 ? 0 : initialWeekIndex
  );
  const currentWeek = allWeeks[currentWeekIndex];
  const currentMonth = format(currentWeek[0], 'MMMM yyyy');
  const progress = Math.min(Math.round((points / rewardGoal) * 100), 100);

  const handleSend = () => {
    if (points >= 100) setPoints(points - 100);
  };

  const handleRedeem = () => {
    if (points >= 200) setPoints(points - 200);
  };

  const handleAddBirthday = () => {
    if (newBdayName && newBdayDate) {
      setBirthdays([...birthdays, { name: newBdayName, date: newBdayDate }]);
      setNewBdayName('');
      setNewBdayDate('');
      setShowModal(false);
    }
  };

  const birthdaysThisWeek = birthdays.filter(b =>
    currentWeek.some(d => isSameDay(parseISO(b.date), d))
  );

  return (
    <div className="right-panel p-3 bg-gray-100 h-screen overflow-y-auto w-full md:w-[320px] md:min-w-[320px] md:max-w-[320px] md:border-l border-gray-200" >
      {/* Points Section */}
      <div className="mb-4 shadow-md bg-white rounded-xl transition-transform duration-200 hover:scale-y-[1.01] origin-top">
        <div className="p-4">
          <div className="flex justify-between items-center my-2">
            <h6 className="mb-0 font-semibold">Your Points</h6>
            <span className="bg-blue-600 text-white text-3xl font-bold px-4 py-2 rounded-full flex items-center gap-2">
              <FaGem style={{ color: '#00cfff' }} />
              <CountUp end={points} duration={1.5} />
            </span>
          </div>
          <div className="mb-2">
            <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
              <div
                className="bg-green-500 h-full rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <small className="text-gray-500">Reward goal: {rewardGoal} pts</small>
          </div>
          <div className="flex mt-2">
            <button className="px-3 py-1 text-sm border border-blue-600 text-blue-600 rounded-md mr-2 transition-colors duration-200 hover:bg-blue-600 hover:text-white" onClick={handleSend}>
              SEND
            </button>
            <button className="px-3 py-1 text-sm border border-green-600 text-green-600 rounded-md transition-colors duration-200 hover:bg-green-600 hover:text-white" onClick={handleRedeem}>
              REDEEM
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Section */}
      <div className="mb-3 rounded-xl shadow-md bg-white">
        <div className="p-4">
          <h6 className="text-gray-500">{currentMonth}</h6>
          <div className="grid grid-cols-2 gap-2 mt-2">
            {currentWeek.map((date) => {
              const dayName = format(date, 'EEE');
              const dayNumber = format(date, 'd');
              const isToday = isSameDay(date, today);
              const hasBirthday = birthdays.some(b => isSameDay(parseISO(b.date), date));

              return (
                <div
                  key={date.toString()}
                  className={classNames('text-center rounded-md h-12 flex flex-col justify-center items-center text-xs font-medium', {
                    'bg-yellow-400 text-gray-800 font-bold': isToday && !hasBirthday,
                    'bg-pink-100 border border-pink-400 text-pink-700': hasBirthday,
                    'bg-blue-100 text-blue-800': !isToday && !hasBirthday,
                  })}
                >
                  <div className="font-semibold">{dayName.toUpperCase()}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {dayNumber} {hasBirthday && '🎂'}
                  </div>
                </div>
              );
            })}

            <button
              className="bg-green-200 text-green-800 rounded-md h-12 flex items-center justify-center text-sm font-bold transition-colors duration-200 hover:bg-green-300 cursor-pointer"
              onClick={() => setShowModal(true)}
            >
              <FaBirthdayCake className="mr-1" style={{ color: '#ff69b4' }} />
              Birthdays
            </button>
          </div>

          {birthdaysThisWeek.length > 0 && (
            <div className="mt-2">
              <small className="text-gray-500">This Week:</small>
              <ul className="ml-3 mt-1 list-disc list-inside">
                {birthdaysThisWeek.map((b, i) => (
                  <li key={i} className="text-xs text-gray-600">
                    {b.name} — {format(parseISO(b.date), 'do MMM')}
                  </li>
                ))}
              </ul>
            </div>
          )}

          <div className="flex justify-between mt-2">
            {currentWeekIndex > 0 && (
              <button
                className="bg-green-200 text-green-800 rounded-md px-3 py-1 text-xs font-bold transition-colors duration-200 hover:bg-green-300 cursor-pointer"
                onClick={() => setCurrentWeekIndex(i => i - 1)}
              >
                ← Prev Week
              </button>
            )}
            {currentWeekIndex < allWeeks.length - 1 && (
              <button
                className="bg-green-200 text-green-800 rounded-md px-3 py-1 text-xs font-bold transition-colors duration-200 hover:bg-green-300 cursor-pointer ml-auto"
                onClick={() => setCurrentWeekIndex(i => i + 1)}
              >
                Next Week →
              </button>
            )}
          </div>

          <div className="mt-2">
            <small className="text-gray-500">Work anniversary</small>
          </div>
        </div>
      </div>

      {/* Meetings */}
      <div className="mb-3 rounded-xl shadow-md bg-white">
        <div className="p-4">
          <ul className="divide-y divide-gray-200">
            <li className="flex justify-between items-center py-2">
              <div>
                <FaUser size={18} className="text-purple-600 mr-2 inline-block" />
                <strong className="text-gray-900">Weekly Review Meeting</strong>
                <div className="text-gray-500 text-xs mt-1">11:00 am - 12:00 pm</div>
              </div>
              <span className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded-md">
                +6 attending
              </span>
            </li>
            <li className="py-2">
              <strong className="text-gray-900">Client Meeting - RAB</strong>
              <div className="text-gray-500 text-xs mt-1">01:00 pm - 02:00 pm</div>
            </li>
          </ul>
        </div>
      </div>

      {/* Events */}
      <div className="rounded-xl shadow-md bg-white">
        <div className="p-4">
          <h6>
            <FaCalendar className="text-green-500 mr-2 inline-block" />
            Upcoming Events
          </h6>
          <ul className="divide-y divide-gray-200">
            <li className="py-2">
              <div className="flex justify-between">
                <span className="text-gray-900">Team Building Workshop</span>
                <small className="text-gray-500">15 Oct</small>
              </div>
              <small className="text-gray-500 block">10:00 AM - 2:00 PM</small>
            </li>
            <li className="py-2">
              <div className="flex justify-between">
                <span className="text-gray-900">Employee of the Month Award</span>
                <small className="text-gray-500">20 Oct</small>
              </div>
              <small className="text-gray-500 block">3:00 PM - 4:30 PM</small>
            </li>
            <li className="py-2">
              <div className="flex justify-between">
                <span className="text-gray-900">Diversity and Inclusion Seminar</span>
                <small className="text-gray-500">5 Nov</small>
              </div>
              <small className="text-gray-500 block">9:30 AM - 12:00 PM</small>
            </li>
            <li className="py-2 font-bold">
              <div className="flex justify-between">
                <span className="text-gray-900">Town Hall Meeting</span>
                <small className="text-gray-500">10 Nov</small>
              </div>
            </li>
          </ul>
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-sm">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold">Add Birthday</h3>
              <button className="text-gray-500 hover:text-gray-800" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label className="block text-gray-700 font-semibold mb-1">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newBdayName}
                  onChange={(e) => setNewBdayName(e.target.value)}
                  placeholder="Enter name"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Date</label>
                <input
                  type="date"
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={newBdayDate}
                  onChange={(e) => setNewBdayDate(e.target.value)}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700" onClick={handleAddBirthday}>
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function MergedFeed() {
  return (
    <div
      className="app-container flex flex-col md:flex-row flex-nowrap h-screen overflow-hidden bg-white"
    >
      <div className="flex-grow flex-1 min-w-0 md:max-w-[calc(100vw-320px)] overflow-y-auto scrollbar-hidden">
        <MainContent />
      </div>
      <div
        className="right-panel w-full md:w-[320px] md:min-w-[320px] h-auto md:h-screen overflow-y-auto scrollbar-hidden"
      >
        <RightPanel />
      </div>
    </div>
  );
}

export default MergedFeed;