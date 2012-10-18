class Ability
  include CanCan::Ability

  def initialize(user)
      can :manage, :all if user.role == "staff"
      can :read, :all if user.role =="user"
  end
end
