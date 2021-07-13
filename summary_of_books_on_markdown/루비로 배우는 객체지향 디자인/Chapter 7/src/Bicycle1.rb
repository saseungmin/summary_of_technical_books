class Schedule
  def scheduled?(schedulable, start_date, end_date)
    puts "This #{schedulable.class} " +
        "is not scheduled\n" +
        "between #{start_date} and #{end_date}"
    false
  end
end

class Bicycle
  attr_reader :schedule, :size, :chain, :tire_size

  # Schedule을 주입하여 기본값을 제공한다.
  def initialize(args={})
    @schedule = args[:schedule] || Schedule.new
    # ...
  end

  # Bicycle의 준비기간이 감안해서, 주어진 기간에
  # bicycle을 사용할 수 있으면 true를 반환한다.
  def schedulable?(start_date, end_date)
    !scheduled?(start_date - lead_days, end_date)
  end

  # schedule의 답변을 반환한다.
  def scheduled?(start_date, end_date)
    schedule.scheduled?(self, start_date, end_date)
  end

  # bicycle을 사용하기 전에 필요한 준비시간의 일수를 반한한다.
  def lead_days
    1
  end

  # ...
end

require 'date'
starting = Date.parse("2015/09/04")
ending = Date.parse("2015/09/10")

b = Bicycle.new
b.schedulable?(starting, ending) # true