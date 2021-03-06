Ol::Application.routes.draw do
  devise_for :staffs, :skip => [:new_staff_registration]
  as :staff do
    get 'a/really/really/really/really/long/route/for/staff/to/sign/up' => 'devise/registrations#new', :as => :new_staff_registration
  end

  get "lessons/:id/showedit" => "lessons#showedit"
  get "usr/manage"
  get "usr/profile"
  get "usr/staff"
  get "questionanswers/new"  
  match "usr/manage/:id" => "subjects#edit"
  devise_for :users, controllers: {omniauth_callbacks: "omniauth_callbacks"}

  resources :subjects do
    resources :topics
  end
  
  resources :topics do
    resources :lessons
  end

  resources :lessons do
    resources :checkpoints
  end

  resources :topics
  resources :lessons do 
    collection {post :sort}
  end
  resources :checkpoints do
    collection {post :sort}
  end
  resources :summaries do
    collection {post :sort}
  end
  
  resources :questionanswers
  
  get "pages/index"
  get "pages/team"
  get "pages/opportunities"
  get "pages/partners"
  get "pages/presskit"
  get "pages/contact"
  get "pages/test"

  root to: "pages#index"

  match "*path" => 'error#handle404'
end
