"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  let favButton = "";
  if(currentUser)
  {
    if(currentUser.favSet.has(story))
    {
      favButton = '<a href="#" class="favButton">★</a>'
    }  
    else
    {
      favButton = '<a href="#" class="favButton">☆</a>'
    }
  }
  let deleteButton = "";
  if(currentUser && currentUser.ownSet.has(story.storyId))
    {
      deleteButton = '<a href="#" class="delButton">X</a>'
    }  
  
  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        ${favButton}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        ${deleteButton}
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");
  
  $allStoriesList.empty();
  currentUser.CreateSet();
  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

function OnPostSubmitClicked(evt)
{
  evt.preventDefault();
  let newPost = {author:$postAuthor.val(), title:$postTitle.val(),  url:$postURL.val()}
  $postAuthor.val("");
  $postTitle.val("");
  $postURL.val("");
  console.log(newPost)
  storyList.addStory(currentUser,newPost)
  
}
$('#submitForm').on("submit",OnPostSubmitClicked)

function DisplayFavorites()
{
  $allStoriesList.empty();
  currentUser.CreateSet();
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

$navFav.on("click",DisplayFavorites);
function DisplayMine()
{
  $allStoriesList.empty();
  currentUser.CreateSet();
  for (let story of currentUser.ownStories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  
  $allStoriesList.show();
}
$navMine.on("click",DisplayMine);

function AppendAdditionalStories(stories)
{
  currentUser.CreateSet();
  for (let story of stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
}