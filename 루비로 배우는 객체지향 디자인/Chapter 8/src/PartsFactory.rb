module PartsFactory
  def self.build(
    config,
    part_class = Part,
    parts_class = Parts
  )
    parts_class.new(
      config.collect {|part_config|
        part_class.new(
          name: part_config[0],
          description: part_config[1],
          needs_spare: part_config.fetch(2, true)
        )
      }
    ) 
  end
end

class Bicycle
  attr_reader :size, :parts

  def initialize(args={})
    @size = args[:size]
    @parts = args[:parts]
  end

  def spares
    parts.spares
  end
end

class Parts < Array
  def spares
    select{|part| part.needs_spare}
  end
end

class Part
  attr_reader :name, :description, :needs_spare

  def initialize(args)
    @name = args[:name]
    @description = args[:description]
    @needs_spare = args.fetch(:needs_spare, true)
  end
end

road_config = [
  ['chain', '10-speed'],
  ['tire_size', '23'],
  ['tape_color', 'red']
]

mountain_config = [
  ['chain', '10-speed'],
  ['tire_size', '2.1'],
  ['front_size', 'Manitou', false],
  ['rear_shock', 'Fox']
]

road_parts = PartsFactory.build(road_config)
mountain_parts = PartsFactory.build(mountain_config)