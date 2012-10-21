class Ability
  include CanCan::Ability

  def initialize(user)      
    if user.is_a?(Staff)
      can :manage, :all
    elsif user.is_a?(User)
      can :read, :all
    else
      can :read, :all
    end
  end
end
